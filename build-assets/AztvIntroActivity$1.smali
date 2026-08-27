.class final Ldev/cobalt/shell/AztvIntroActivity$1;
.super Ljava/lang/Object;
.implements Landroid/media/MediaPlayer$OnCompletionListener;

.field final synthetic this$0:Ldev/cobalt/shell/AztvIntroActivity;

.method constructor <init>(Ldev/cobalt/shell/AztvIntroActivity;)V
    .locals 0
    iput-object p1, p0, Ldev/cobalt/shell/AztvIntroActivity$1;->this$0:Ldev/cobalt/shell/AztvIntroActivity;
    invoke-direct {p0}, Ljava/lang/Object;-><init>()V
    return-void
.end method

.method public onCompletion(Landroid/media/MediaPlayer;)V
    .locals 1
    iget-object v0, p0, Ldev/cobalt/shell/AztvIntroActivity$1;->this$0:Ldev/cobalt/shell/AztvIntroActivity;
    invoke-virtual {v0}, Ldev/cobalt/shell/AztvIntroActivity;->openMain()V
    return-void
.end method
