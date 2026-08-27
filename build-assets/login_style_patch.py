from pathlib import Path

p = Path('decoded/smali/dev/cobalt/shell/AztvLoginActivity.smali')
s = p.read_text()

# Original Tube-style dark purple background instead of plain black.
s = s.replace(
    'const/high16 v1, -0x1000000\n    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->setBackgroundColor(I)V',
    'const v1, -0xf1f1e7\n    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->setBackgroundColor(I)V',
    1,
)

# Bring back the wording and spacing from the original activity_login_tube screen.
s = s.replace('const-string v5, "Iniciar sesión"', 'const-string v5, "Watch the latest\\nvideos, just for you\\n\\nSign in"', 1)
s = s.replace('const/high16 v5, 0x41800000', 'const/high16 v5, 0x41a00000', 1)
s = s.replace('const-string v5, "Usuario"', 'const-string v5, "username"', 1)
s = s.replace('const-string v6, "Contraseña"', 'const-string v6, "password"', 1)
s = s.replace('const-string v5, "Entrar"', 'const-string v5, "Sign in"', 1)

# White input boxes with black text, matching the original layout.
needle = 'invoke-virtual {v3, v5}, Landroid/widget/EditText;->setHintTextColor(I)V\n    const/16 v6, 0x12'
repl = 'invoke-virtual {v3, v5}, Landroid/widget/EditText;->setHintTextColor(I)V\n    const/4 v5, -0x1\n    invoke-virtual {v3, v5}, Landroid/widget/EditText;->setBackgroundColor(I)V\n    const/high16 v4, -0x1000000\n    invoke-virtual {v3, v4}, Landroid/widget/EditText;->setTextColor(I)V\n    const/16 v6, 0x12'
s = s.replace(needle, repl, 1)

needle2 = 'invoke-virtual {v3, v5}, Landroid/widget/EditText;->setHintTextColor(I)V\n    const/16 v5, 0x81'
repl2 = 'invoke-virtual {v3, v5}, Landroid/widget/EditText;->setHintTextColor(I)V\n    const/4 v5, -0x1\n    invoke-virtual {v3, v5}, Landroid/widget/EditText;->setBackgroundColor(I)V\n    const/high16 v4, -0x1000000\n    invoke-virtual {v3, v4}, Landroid/widget/EditText;->setTextColor(I)V\n    const/16 v5, 0x81'
s = s.replace(needle2, repl2, 1)

# Purple sign-in button with white lettering.
needle3 = 'invoke-virtual {v3, v5}, Landroid/widget/Button;->setText(Ljava/lang/CharSequence;)V\n    invoke-virtual {v3, p0}, Landroid/widget/Button;->setOnClickListener(Landroid/view/View$OnClickListener;)V'
repl3 = 'invoke-virtual {v3, v5}, Landroid/widget/Button;->setText(Ljava/lang/CharSequence;)V\n    const/4 v5, -0x1\n    invoke-virtual {v3, v5}, Landroid/widget/Button;->setTextColor(I)V\n    const v5, -0x8b14a8\n    invoke-virtual {v3, v5}, Landroid/widget/Button;->setBackgroundColor(I)V\n    invoke-virtual {v3, p0}, Landroid/widget/Button;->setOnClickListener(Landroid/view/View$OnClickListener;)V'
s = s.replace(needle3, repl3, 1)

p.write_text(s)
print('Original Tube-style login applied')
