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

.method public onTouchEvent(Landroid/view/MotionEvent;)Z
    .locals 1
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
