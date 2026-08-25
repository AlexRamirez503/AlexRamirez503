.method private getEventForwarder()Lorg/chromium/ui/base/EventForwarder;
    .locals 1
    iget-object v0, p0, Ldev/cobalt/shell/ContentViewRenderView;->mWebContents:Lorg/chromium/content_public/browser/WebContents;
    if-eqz v0, :return_null
    invoke-interface {v0}, Lorg/chromium/content_public/browser/WebContents;->isDestroyed()Z
    move-result v0
    if-eqz v0, :get_forwarder
:return_null
    const/4 v0, 0x0
    return-object v0
:get_forwarder
    iget-object v0, p0, Ldev/cobalt/shell/ContentViewRenderView;->mWebContents:Lorg/chromium/content_public/browser/WebContents;
    invoke-interface {v0}, Lorg/chromium/content_public/browser/WebContents;->getEventForwarder()Lorg/chromium/ui/base/EventForwarder;
    move-result-object v0
    return-object v0
.end method

.method private sendDpad(I)V
    .locals 4
    invoke-virtual {p0}, Ldev/cobalt/shell/ContentViewRenderView;->getContext()Landroid/content/Context;
    move-result-object v0
    instance-of v1, v0, Landroid/app/Activity;
    if-eqz v1, :done
    check-cast v0, Landroid/app/Activity;
    new-instance v1, Landroid/view/KeyEvent;
    const/4 v2, 0x0
    invoke-direct {v1, v2, p1}, Landroid/view/KeyEvent;-><init>(II)V
    invoke-virtual {v0, v1}, Landroid/app/Activity;->dispatchKeyEvent(Landroid/view/KeyEvent;)Z
    new-instance v1, Landroid/view/KeyEvent;
    const/4 v2, 0x1
    invoke-direct {v1, v2, p1}, Landroid/view/KeyEvent;-><init>(II)V
    invoke-virtual {v0, v1}, Landroid/app/Activity;->dispatchKeyEvent(Landroid/view/KeyEvent;)Z
:done
    return-void
.end method

.method private seek30(I)V
    .locals 2
    const/4 v0, 0x0
:loop
    const/4 v1, 0x3
    if-ge v0, v1, :done
    invoke-direct {p0, p1}, Ldev/cobalt/shell/ContentViewRenderView;->sendDpad(I)V
    add-int/lit8 v0, v0, 0x1
    goto :loop
:done
    return-void
.end method

.method public onTouchEvent(Landroid/view/MotionEvent;)Z
    .locals 10
    invoke-virtual {p1}, Landroid/view/MotionEvent;->getActionMasked()I
    move-result v0
    if-nez v0, :check_move
    invoke-virtual {p1}, Landroid/view/MotionEvent;->getX()F
    move-result v1
    iput v1, p0, Ldev/cobalt/shell/ContentViewRenderView;->mAztvTouchStartX:F
    invoke-virtual {p1}, Landroid/view/MotionEvent;->getY()F
    move-result v1
    iput v1, p0, Ldev/cobalt/shell/ContentViewRenderView;->mAztvTouchStartY:F
    const/4 v1, 0x0
    iput-boolean v1, p0, Ldev/cobalt/shell/ContentViewRenderView;->mAztvTouchMoved:Z
    goto :forward

:check_move
    const/4 v1, 0x2
    if-ne v0, v1, :check_up
    iget-boolean v1, p0, Ldev/cobalt/shell/ContentViewRenderView;->mAztvTouchMoved:Z
    if-eqz v1, :measure_move
    const/4 v0, 0x1
    return v0
:measure_move
    invoke-virtual {p1}, Landroid/view/MotionEvent;->getX()F
    move-result v2
    invoke-virtual {p1}, Landroid/view/MotionEvent;->getY()F
    move-result v3
    iget v4, p0, Ldev/cobalt/shell/ContentViewRenderView;->mAztvTouchStartX:F
    sub-float v4, v2, v4
    iget v5, p0, Ldev/cobalt/shell/ContentViewRenderView;->mAztvTouchStartY:F
    sub-float v5, v3, v5
    invoke-static {v4}, Ljava/lang/Math;->abs(F)F
    move-result v6
    invoke-static {v5}, Ljava/lang/Math;->abs(F)F
    move-result v7
    const/high16 v1, 0x42480000    # 50.0f
    cmpl-float v0, v6, v1
    if-gez v0, :do_nav
    cmpl-float v0, v7, v1
    if-gez v0, :do_nav
    const/4 v0, 0x1
    return v0

:do_nav
    const/4 v0, 0x1
    iput-boolean v0, p0, Ldev/cobalt/shell/ContentViewRenderView;->mAztvTouchMoved:Z
    cmpl-float v0, v7, v6
    if-lez v0, :horizontal
    const/4 v0, 0x0
    cmpg-float v0, v5, v0
    if-gez v0, :finger_down
    const/16 v0, 0x13
    invoke-direct {p0, v0}, Ldev/cobalt/shell/ContentViewRenderView;->sendDpad(I)V
    const/4 v0, 0x1
    return v0
:finger_down
    const/16 v0, 0x14
    invoke-direct {p0, v0}, Ldev/cobalt/shell/ContentViewRenderView;->sendDpad(I)V
    const/4 v0, 0x1
    return v0

:horizontal
    const/4 v0, 0x0
    cmpg-float v0, v4, v0
    if-gez v0, :finger_right
    const/16 v0, 0x15
    invoke-direct {p0, v0}, Ldev/cobalt/shell/ContentViewRenderView;->sendDpad(I)V
    const/4 v0, 0x1
    return v0
:finger_right
    const/16 v0, 0x16
    invoke-direct {p0, v0}, Ldev/cobalt/shell/ContentViewRenderView;->sendDpad(I)V
    const/4 v0, 0x1
    return v0

:check_up
    const/4 v1, 0x1
    if-ne v0, v1, :forward
    iget-boolean v1, p0, Ldev/cobalt/shell/ContentViewRenderView;->mAztvTouchMoved:Z
    if-nez v1, :consume
    invoke-static {}, Landroid/os/SystemClock;->uptimeMillis()J
    move-result-wide v2
    iget-wide v4, p0, Ldev/cobalt/shell/ContentViewRenderView;->mAztvLastTapTime:J
    sub-long v6, v2, v4
    const-wide/16 v8, 0x15e
    cmp-long v0, v6, v8
    if-lez v0, :double_tap
    iput-wide v2, p0, Ldev/cobalt/shell/ContentViewRenderView;->mAztvLastTapTime:J
    goto :forward
:double_tap
    const-wide/16 v4, 0x0
    iput-wide v4, p0, Ldev/cobalt/shell/ContentViewRenderView;->mAztvLastTapTime:J
    invoke-virtual {p0}, Ldev/cobalt/shell/ContentViewRenderView;->getWidth()I
    move-result v0
    int-to-float v0, v0
    const/high16 v1, 0x40000000
    div-float/2addr v0, v1
    invoke-virtual {p1}, Landroid/view/MotionEvent;->getX()F
    move-result v1
    cmpg-float v0, v1, v0
    if-gez v0, :double_right
    const/16 v0, 0x15
    invoke-direct {p0, v0}, Ldev/cobalt/shell/ContentViewRenderView;->seek30(I)V
    const/4 v0, 0x1
    return v0
:double_right
    const/16 v0, 0x16
    invoke-direct {p0, v0}, Ldev/cobalt/shell/ContentViewRenderView;->seek30(I)V
    const/4 v0, 0x1
    return v0
:consume
    const/4 v0, 0x1
    return v0

:forward
    invoke-direct {p0}, Ldev/cobalt/shell/ContentViewRenderView;->getEventForwarder()Lorg/chromium/ui/base/EventForwarder;
    move-result-object v0
    if-eqz v0, :call_super
    invoke-virtual {v0, p1}, Lorg/chromium/ui/base/EventForwarder;->onTouchEvent(Landroid/view/MotionEvent;)Z
    move-result v0
    return v0
:call_super
    invoke-super {p0, p1}, Landroid/widget/FrameLayout;->onTouchEvent(Landroid/view/MotionEvent;)Z
    move-result v0
    return v0
.end method
