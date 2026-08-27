from pathlib import Path
import xml.etree.ElementTree as ET
import re

ns='http://schemas.android.com/apk/res/android'
ET.register_namespace('android',ns)
p=Path('decoded/AndroidManifest.xml')
t=ET.parse(p); root=t.getroot(); app=root.find('application')
main_filter=None; target=None
for tag in ('activity','activity-alias'):
    for a in app.findall(tag):
        for f in list(a.findall('intent-filter')):
            acts=[x.get('{%s}name'%ns) for x in f.findall('action')]
            cats=[x.get('{%s}name'%ns) for x in f.findall('category')]
            if 'android.intent.action.MAIN' in acts and 'android.intent.category.LAUNCHER' in cats:
                main_filter=f
                target=a.get('{%s}targetActivity'%ns) if tag=='activity-alias' else a.get('{%s}name'%ns)
                a.remove(f)
                break
        if main_filter is not None: break
    if main_filter is not None: break
if not target: raise SystemExit('No launcher target found')
pkg=root.get('package','')
if target.startswith('.'): target=pkg+target
elif '.' not in target: target=pkg+'.'+target

intro=ET.SubElement(app,'activity',{
    '{%s}name'%ns:'dev.cobalt.shell.AztvIntroActivity',
    '{%s}exported'%ns:'true',
    '{%s}screenOrientation'%ns:'sensorLandscape',
    '{%s}theme'%ns:'@android:style/Theme.Black.NoTitleBar.Fullscreen'})
intro.append(main_filter)
t.write(p,encoding='utf-8',xml_declaration=True)

sm=Path('build-assets/AztvIntroActivity.smali').read_text().replace('__TARGET__',target)
out=Path('decoded/smali/dev/cobalt/shell'); out.mkdir(parents=True,exist_ok=True)
(out/'AztvIntroActivity.smali').write_text(sm)
(out/'AztvIntroActivity$1.smali').write_text(Path('build-assets/AztvIntroActivity$1.smali').read_text())

raw=Path('decoded/res/raw'); raw.mkdir(parents=True,exist_ok=True)
(raw/'intro.mp4').write_bytes(b'placeholder')

# Also hook the real MainActivity so old Android shortcuts cannot bypass the intro.
target_path = Path('decoded/smali') / Path(*target.split('.')).with_suffix('.smali')
if not target_path.exists():
    for rootdir in Path('decoded').glob('smali*'):
        cand = rootdir / Path(*target.split('.')).with_suffix('.smali')
        if cand.exists():
            target_path = cand
            break
if not target_path.exists():
    raise SystemExit(f'MainActivity smali not found: {target}')

s = target_path.read_text()
method_sig = '.method protected onCreate(Landroid/os/Bundle;)V'
start = s.find(method_sig)
if start < 0:
    method_sig = '.method public onCreate(Landroid/os/Bundle;)V'
    start = s.find(method_sig)
if start < 0:
    raise SystemExit('MainActivity onCreate not found')
end = s.find('.end method', start)
chunk = s[start:end]
if 'aztv_skip_intro' not in chunk:
    m = re.search(r'\n\s*\.locals\s+(\d+)', chunk)
    if not m:
        raise SystemExit('MainActivity onCreate does not use .locals')
    n = int(m.group(1))
    if n < 3:
        chunk = chunk[:m.start(1)] + '3' + chunk[m.end(1):]
        m = re.search(r'\n\s*\.locals\s+(\d+)', chunk)
    insert_pos = m.end()
    target_cls='L'+target.replace('.','/')+';'
    hook=f'''\n    invoke-virtual {{p0}}, {target_cls}->getIntent()Landroid/content/Intent;\n    move-result-object v0\n    const-string v1, "aztv_skip_intro"\n    const/4 v2, 0x0\n    invoke-virtual {{v0, v1, v2}}, Landroid/content/Intent;->getBooleanExtra(Ljava/lang/String;Z)Z\n    move-result v0\n    if-nez v0, :aztv_intro_continue\n    new-instance v0, Landroid/content/Intent;\n    const-class v1, Ldev/cobalt/shell/AztvIntroActivity;\n    invoke-direct {{v0, p0, v1}}, Landroid/content/Intent;-><init>(Landroid/content/Context;Ljava/lang/Class;)V\n    invoke-virtual {{p0, v0}}, {target_cls}->startActivity(Landroid/content/Intent;)V\n    invoke-virtual {{p0}}, {target_cls}->finish()V\n    return-void\n:aztv_intro_continue\n'''
    chunk = chunk[:insert_pos] + hook + chunk[insert_pos:]
    s = s[:start] + chunk + s[end:]
    target_path.write_text(s)

print('Intro forced before ->',target,'at',target_path)
