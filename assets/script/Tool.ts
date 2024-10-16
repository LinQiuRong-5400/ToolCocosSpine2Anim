import { _decorator, assetManager, Camera, Component, error, ImageAsset, instantiate, Label, math, native, Node, Prefab, RenderTexture, Size, Sprite, SpriteFrame, sys, Texture2D, UITransform, v3, Vec3, view } from 'cc';
import { Canvas2Image } from './Canvas2Image';
const { ccclass, property } = _decorator;

@ccclass('Tool')
export class Tool extends Component {

    @property(Node)
    root: Node = null!;
    @property(Node)
    sizeNode: Node = null;
    @property(Camera)
    rootCamera: Camera = null!;

    rt: RenderTexture = null;
    _buffer: ArrayBufferView = null!;
    _canvas: HTMLCanvasElement = null!;
    canvas2image: Canvas2Image = null!;

    initClampTexture () {
        this.canvas2image = Canvas2Image.getInstance();
        this.rt = new RenderTexture();
        let rtSize = new math.Size;
        rtSize.width = Math.round(view.getVisibleSize().width);
        rtSize.height = Math.round(view.getVisibleSize().height);
        this.rt.reset(rtSize);
        this.rootCamera.targetTexture = this.rt;
    }

    beginClampTexture () {
        const rootTransform = this.sizeNode.getComponent(UITransform);
        var worldPos = this.sizeNode.getWorldPosition();
        this._buffer = this.rt.readPixels(Math.round(worldPos.x-rootTransform.width*0.5), Math.round(worldPos.y-rootTransform.height*0.5), Math.round(rootTransform.width), Math.round(rootTransform.height));
    }

    onSaveQRCodeClicked (_buffer?) {
        const rootTransform = this.sizeNode.getComponent(UITransform);
        let buffer;
        if (_buffer) {
            buffer = _buffer;
        } else {
            buffer = this._buffer;
        }
        this.savaAsImage(rootTransform.width, rootTransform.height, buffer);
    }

    savaAsImage(width: number, height: number, arrayBuffer: any) {
        let w = Math.floor(width);
        let h = Math.floor(height)
        if (sys.isBrowser) {
            if (!this._canvas) {
                this._canvas = document.createElement('canvas');
                this._canvas.width = w;
                this._canvas.height = h;
            } else {
                this.clearCanvas();
            }
            let ctx = this._canvas.getContext('2d')!;
            let rowBytes = w * 4;
            for (let row = 0; row < h; row++) {
                let sRow = h - 1 - row;
                let imageData = ctx.createImageData(w, 1);
                let start = sRow * w * 4;
                for (let i = 0; i < rowBytes; i++) {
                    imageData.data[i] = arrayBuffer[start + i];
                }
                ctx.putImageData(imageData, 0, row);
            }
            this.canvas2image.saveAsPNG(this._canvas, w, h);
        }
    }

    clearCanvas() {
        let ctx = this._canvas.getContext('2d');
        ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
}


