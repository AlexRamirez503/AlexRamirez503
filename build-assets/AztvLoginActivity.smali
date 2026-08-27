.class public Ldev/cobalt/shell/AztvLoginActivity;
.super Landroid/app/Activity;
.implements Landroid/view/View$OnClickListener;
.source "AztvLoginActivity.java"

.field private mUser:Landroid/widget/EditText;
.field private mPass:Landroid/widget/EditText;
.field private mError:Landroid/widget/TextView;

.method public constructor <init>()V
    .locals 0
    invoke-direct {p0}, Landroid/app/Activity;-><init>()V
    return-void
.end method

.method protected onCreate(Landroid/os/Bundle;)V
    .locals 8
    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V

    invoke-virtual {p0}, Landroid/app/Activity;->getWindow()Landroid/view/Window;
    move-result-object v0
    const/16 v1, 0x400
    invoke-virtual {v0, v1, v1}, Landroid/view/Window;->setFlags(II)V

    new-instance v0, Landroid/widget/LinearLayout;
    invoke-direct {v0, p0}, Landroid/widget/LinearLayout;-><init>(Landroid/content/Context;)V
    const/4 v1, 0x1
    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->setOrientation(I)V
    const/16 v1, 0x11
    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->setGravity(I)V
    const/high16 v1, -0x1000000
    invoke-virtual {v0, v1}, Landroid/widget/LinearLayout;->setBackgroundColor(I)V
    const/16 v1, 0x78
    const/16 v2, 0x28
    invoke-virtual {v0, v1, v2, v1, v2}, Landroid/widget/LinearLayout;->setPadding(IIII)V

    new-instance v3, Landroid/widget/TextView;
    invoke-direct {v3, p0}, Landroid/widget/TextView;-><init>(Landroid/content/Context;)V
    const-string v4, "AztvTube"
    invoke-virtual {v3, v4}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V
    const/high16 v4, 0x41e00000    # 28.0f
    invoke-virtual {v3, v4}, Landroid/widget/TextView;->setTextSize(F)V
    const/4 v4, -0x1
    invoke-virtual {v3, v4}, Landroid/widget/TextView;->setTextColor(I)V
    const/16 v5, 0x11
    invoke-virtual {v3, v5}, Landroid/widget/TextView;->setGravity(I)V
    invoke-virtual {v0, v3}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    new-instance v3, Landroid/widget/TextView;
    invoke-direct {v3, p0}, Landroid/widget/TextView;-><init>(Landroid/content/Context;)V
    const-string v5, "Iniciar sesión"
    invoke-virtual {v3, v5}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V
    const/high16 v5, 0x41800000    # 16.0f
    invoke-virtual {v3, v5}, Landroid/widget/TextView;->setTextSize(F)V
    invoke-virtual {v3, v4}, Landroid/widget/TextView;->setTextColor(I)V
    const/16 v5, 0x11
    invoke-virtual {v3, v5}, Landroid/widget/TextView;->setGravity(I)V
    const/4 v5, 0x0
    const/16 v6, 0x8
    const/16 v7, 0x18
    invoke-virtual {v3, v5, v6, v5, v7}, Landroid/widget/TextView;->setPadding(IIII)V
    invoke-virtual {v0, v3}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    new-instance v3, Landroid/widget/EditText;
    invoke-direct {v3, p0}, Landroid/widget/EditText;-><init>(Landroid/content/Context;)V
    iput-object v3, p0, Ldev/cobalt/shell/AztvLoginActivity;->mUser:Landroid/widget/EditText;
    const-string v5, "Usuario"
    invoke-virtual {v3, v5}, Landroid/widget/EditText;->setHint(Ljava/lang/CharSequence;)V
    invoke-virtual {v3, v4}, Landroid/widget/EditText;->setTextColor(I)V
    const v5, -0x777778
    invoke-virtual {v3, v5}, Landroid/widget/EditText;->setHintTextColor(I)V
    const/16 v6, 0x12
    invoke-virtual {v3, v6, v6, v6, v6}, Landroid/widget/EditText;->setPadding(IIII)V
    invoke-virtual {v0, v3}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    new-instance v3, Landroid/widget/EditText;
    invoke-direct {v3, p0}, Landroid/widget/EditText;-><init>(Landroid/content/Context;)V
    iput-object v3, p0, Ldev/cobalt/shell/AztvLoginActivity;->mPass:Landroid/widget/EditText;
    const-string v6, "Contraseña"
    invoke-virtual {v3, v6}, Landroid/widget/EditText;->setHint(Ljava/lang/CharSequence;)V
    invoke-virtual {v3, v4}, Landroid/widget/EditText;->setTextColor(I)V
    invoke-virtual {v3, v5}, Landroid/widget/EditText;->setHintTextColor(I)V
    const/16 v5, 0x81
    invoke-virtual {v3, v5}, Landroid/widget/EditText;->setInputType(I)V
    const/16 v5, 0x12
    invoke-virtual {v3, v5, v5, v5, v5}, Landroid/widget/EditText;->setPadding(IIII)V
    invoke-virtual {v0, v3}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    new-instance v3, Landroid/widget/Button;
    invoke-direct {v3, p0}, Landroid/widget/Button;-><init>(Landroid/content/Context;)V
    const-string v5, "Entrar"
    invoke-virtual {v3, v5}, Landroid/widget/Button;->setText(Ljava/lang/CharSequence;)V
    invoke-virtual {v3, p0}, Landroid/widget/Button;->setOnClickListener(Landroid/view/View$OnClickListener;)V
    invoke-virtual {v0, v3}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    new-instance v3, Landroid/widget/TextView;
    invoke-direct {v3, p0}, Landroid/widget/TextView;-><init>(Landroid/content/Context;)V
    iput-object v3, p0, Ldev/cobalt/shell/AztvLoginActivity;->mError:Landroid/widget/TextView;
    const v5, -0x10000
    invoke-virtual {v3, v5}, Landroid/widget/TextView;->setTextColor(I)V
    const/16 v5, 0x11
    invoke-virtual {v3, v5}, Landroid/widget/TextView;->setGravity(I)V
    invoke-virtual {v0, v3}, Landroid/widget/LinearLayout;->addView(Landroid/view/View;)V

    invoke-virtual {p0, v0}, Landroid/app/Activity;->setContentView(Landroid/view/View;)V
    return-void
.end method

.method public onClick(Landroid/view/View;)V
    .locals 5
    iget-object v0, p0, Ldev/cobalt/shell/AztvLoginActivity;->mUser:Landroid/widget/EditText;
    invoke-virtual {v0}, Landroid/widget/EditText;->getText()Landroid/text/Editable;
    move-result-object v0
    invoke-virtual {v0}, Ljava/lang/Object;->toString()Ljava/lang/String;
    move-result-object v0
    invoke-virtual {v0}, Ljava/lang/String;->trim()Ljava/lang/String;
    move-result-object v0

    iget-object v1, p0, Ldev/cobalt/shell/AztvLoginActivity;->mPass:Landroid/widget/EditText;
    invoke-virtual {v1}, Landroid/widget/EditText;->getText()Landroid/text/Editable;
    move-result-object v1
    invoke-virtual {v1}, Ljava/lang/Object;->toString()Ljava/lang/String;
    move-result-object v1

    invoke-virtual {v0}, Ljava/lang/String;->length()I
    move-result v2
    if-eqz v2, :invalid
    invoke-virtual {v1}, Ljava/lang/String;->length()I
    move-result v2
    if-eqz v2, :invalid

    invoke-virtual {p0}, Landroid/app/Activity;->getSharedPreferences(Ljava/lang/String;I)Landroid/content/SharedPreferences;
    move-result-object v2
    goto :open

:invalid
    iget-object v2, p0, Ldev/cobalt/shell/AztvLoginActivity;->mError:Landroid/widget/TextView;
    const-string v3, "Escribe usuario y contraseña"
    invoke-virtual {v2, v3}, Landroid/widget/TextView;->setText(Ljava/lang/CharSequence;)V
    return-void

:open
    new-instance v2, Landroid/content/Intent;
    invoke-direct {v2}, Landroid/content/Intent;-><init>()V
    invoke-virtual {p0}, Landroid/app/Activity;->getPackageName()Ljava/lang/String;
    move-result-object v3
    const-string v4, "__TARGET__"
    invoke-virtual {v2, v3, v4}, Landroid/content/Intent;->setClassName(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;
    const-string v3, "aztv_skip_intro"
    const/4 v4, 0x1
    invoke-virtual {v2, v3, v4}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Z)Landroid/content/Intent;
    const-string v3, "aztv_user"
    invoke-virtual {v2, v3, v0}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;
    const-string v3, "aztv_pass"
    invoke-virtual {v2, v3, v1}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;
    invoke-virtual {p0, v2}, Landroid/app/Activity;->startActivity(Landroid/content/Intent;)V
    invoke-virtual {p0}, Landroid/app/Activity;->finish()V
    return-void
.end method
