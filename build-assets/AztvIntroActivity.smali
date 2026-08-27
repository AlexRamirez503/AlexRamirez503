.class public Ldev/cobalt/shell/AztvIntroActivity;
.super Landroid/app/Activity;
.source "AztvIntroActivity.java"

.field private mVideo:Landroid/widget/VideoView;

.method public constructor <init>()V
    .locals 0
    invoke-direct {p0}, Landroid/app/Activity;-><init>()V
    return-void
.end method

.method protected onCreate(Landroid/os/Bundle;)V
    .locals 4
    invoke-super {p0, p1}, Landroid/app/Activity;->onCreate(Landroid/os/Bundle;)V
    invoke-virtual {p0}, Landroid/app/Activity;->getWindow()Landroid/view/Window;
    move-result-object v0
    const/16 v1, 0x400
    invoke-virtual {v0, v1, v1}, Landroid/view/Window;->setFlags(II)V
    new-instance v0, Landroid/widget/VideoView;
    invoke-direct {v0, p0}, Landroid/widget/VideoView;-><init>(Landroid/content/Context;)V
    iput-object v0, p0, Ldev/cobalt/shell/AztvIntroActivity;->mVideo:Landroid/widget/VideoView;
    invoke-virtual {p0, v0}, Landroid/app/Activity;->setContentView(Landroid/view/View;)V
    invoke-virtual {p0}, Landroid/app/Activity;->getResources()Landroid/content/res/Resources;
    move-result-object v0
    const-string v1, "intro"
    const-string v2, "raw"
    invoke-virtual {p0}, Landroid/app/Activity;->getPackageName()Ljava/lang/String;
    move-result-object v3
    invoke-virtual {v0, v1, v2, v3}, Landroid/content/res/Resources;->getIdentifier(Ljava/lang/String;Ljava/lang/String;Ljava/lang/String;)I
    move-result v0
    new-instance v1, Ljava/lang/StringBuilder;
    invoke-direct {v1}, Ljava/lang/StringBuilder;-><init>()V
    const-string v2, "android.resource://"
    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    invoke-virtual {p0}, Landroid/app/Activity;->getPackageName()Ljava/lang/String;
    move-result-object v2
    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    const-string v2, "/"
    invoke-virtual {v1, v2}, Ljava/lang/StringBuilder;->append(Ljava/lang/String;)Ljava/lang/StringBuilder;
    invoke-virtual {v1, v0}, Ljava/lang/StringBuilder;->append(I)Ljava/lang/StringBuilder;
    invoke-virtual {v1}, Ljava/lang/StringBuilder;->toString()Ljava/lang/String;
    move-result-object v0
    invoke-static {v0}, Landroid/net/Uri;->parse(Ljava/lang/String;)Landroid/net/Uri;
    move-result-object v0
    iget-object v1, p0, Ldev/cobalt/shell/AztvIntroActivity;->mVideo:Landroid/widget/VideoView;
    invoke-virtual {v1, v0}, Landroid/widget/VideoView;->setVideoURI(Landroid/net/Uri;)V
    new-instance v0, Ldev/cobalt/shell/AztvIntroActivity$1;
    invoke-direct {v0, p0}, Ldev/cobalt/shell/AztvIntroActivity$1;-><init>(Ldev/cobalt/shell/AztvIntroActivity;)V
    iget-object v1, p0, Ldev/cobalt/shell/AztvIntroActivity;->mVideo:Landroid/widget/VideoView;
    invoke-virtual {v1, v0}, Landroid/widget/VideoView;->setOnCompletionListener(Landroid/media/MediaPlayer$OnCompletionListener;)V
    new-instance v0, Ldev/cobalt/shell/AztvIntroActivity$2;
    invoke-direct {v0, p0}, Ldev/cobalt/shell/AztvIntroActivity$2;-><init>(Ldev/cobalt/shell/AztvIntroActivity;)V
    iget-object v1, p0, Ldev/cobalt/shell/AztvIntroActivity;->mVideo:Landroid/widget/VideoView;
    invoke-virtual {v1, v0}, Landroid/widget/VideoView;->setOnErrorListener(Landroid/media/MediaPlayer$OnErrorListener;)V
    iget-object v0, p0, Ldev/cobalt/shell/AztvIntroActivity;->mVideo:Landroid/widget/VideoView;
    invoke-virtual {v0}, Landroid/widget/VideoView;->start()V
    return-void
.end method

.method public openMain()V
    .locals 3
    new-instance v0, Landroid/content/Intent;
    invoke-direct {v0}, Landroid/content/Intent;-><init>()V
    invoke-virtual {p0}, Landroid/app/Activity;->getPackageName()Ljava/lang/String;
    move-result-object v1
    const-string v2, "__TARGET__"
    invoke-virtual {v0, v1, v2}, Landroid/content/Intent;->setClassName(Ljava/lang/String;Ljava/lang/String;)Landroid/content/Intent;
    const-string v1, "aztv_skip_intro"
    const/4 v2, 0x1
    invoke-virtual {v0, v1, v2}, Landroid/content/Intent;->putExtra(Ljava/lang/String;Z)Landroid/content/Intent;
    invoke-virtual {p0, v0}, Landroid/app/Activity;->startActivity(Landroid/content/Intent;)V
    invoke-virtual {p0}, Landroid/app/Activity;->finish()V
    return-void
.end method
