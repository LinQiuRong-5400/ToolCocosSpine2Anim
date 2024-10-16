import { _decorator, Component, Node, Primitive, Skeleton, sp } from 'cc';
import { Tool } from './Tool';
const { ccclass, property } = _decorator;

@ccclass('manager')
export class manager extends Component {
    @property(Tool)
    tool: Tool = null;
    @property(sp.Skeleton)
    anim: sp.Skeleton = null;
    @property(String)
    animName: string = 'animation';
    _isSaveIamge: boolean = false;
    _isLoadIamge: boolean = false;
    _buffers: any[] = [];
    start() {

    }

    onClickLoad() {
        if (this._buffers.length > 0) {
            this._isLoadIamge = true;
        }
    }
    onClickPlaySave() {
        this.tool.node.active = true;
        this.tool.initClampTexture();
        if (!this.anim._initAnim) {
            this.anim._initAnim = true;
            // this.anim.setStartListener(() => {
                this._isSaveIamge = true;
            // });
            // this.anim.setEndListener(() => {
            //     this._isSaveIamge = false;
            //     // this.tool.node.active = false;
            // });
            this.anim.setCompleteListener(() => {
                this._isSaveIamge = false;
                this.tool.node.active = false;
            });
        }
        if (this.anim.findAnimation(this.animName)) {
            this.anim.clearTracks();
            this._buffers = [];
            this.anim.addAnimation(0,this.animName,false);
        }
    }
    onClickCurrSave() {
        this.tool.node.active = true;
        // this.scheduleOnce(() => {
            this.tool.initClampTexture();
           
            this.scheduleOnce(() => {
                this.tool.beginClampTexture();
                this.tool.onSaveQRCodeClicked();
                this.tool.node.active = false;
            }, 0);
        // }, 0);
    }
    update(dt) {
        if (this._isSaveIamge) {
            this.tool.beginClampTexture();
            this._buffers.push(this.tool._buffer);
        }
        if (this._isLoadIamge) {
            if (this._buffers.length > 0) {
                let buffer = this._buffers.shift();
                this.tool.onSaveQRCodeClicked(buffer);
            } else {
                this._isLoadIamge = false;
            }
        }
    }
}

