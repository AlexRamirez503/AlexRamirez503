from pathlib import Path
import xml.etree.ElementTree as ET
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
print('Intro launcher ->',target)
