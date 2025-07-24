import { _decorator, Component, Node, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Reel')
export class Reel extends Component {
    @property([Node])
    symbols: Node[] = [];

    @property
    public speed: number = 800;

    private spinning: boolean = false;
    private spinTime: number = 0;
    private duration: number = 2;
    private isStopping: boolean = false;

    private snapPoints: number[] = [310, 140, -30];

    public spin(duration: number) {
        this.spinning = true;
        this.spinTime = 0;
        this.duration = duration;
        this.isStopping = false;
    }

    update(dt: number) {
        if (!this.spinning) return;

        this.spinTime += dt;

        for (const symbol of this.symbols) {
            const pos = symbol.getPosition();
            let newY = pos.y - this.speed * dt;

            if (newY < -100) {
                newY = 400; // 重設到頂端
            }

            symbol.setPosition(new Vec3(pos.x, newY, pos.z));
        }

        if (this.spinTime >= this.duration && !this.isStopping) {
            this.isStopping = true;
            this.scheduleOnce(() => {
                this.alignToGrid();
                this.spinning = false;
            }, 0.1);
        }
    }

    private alignToGrid() {
        this.symbols.forEach(symbol => {
            const y = symbol.getPosition().y;
            let closest = this.snapPoints[0];
            let minDist = Math.abs(y - closest);

            for (let i = 1; i < this.snapPoints.length; i++) {
                const dist = Math.abs(y - this.snapPoints[i]);
                if (dist < minDist) {
                    closest = this.snapPoints[i];
                    minDist = dist;
                }
            }

            const pos = symbol.getPosition();
            symbol.setPosition(new Vec3(pos.x, closest, pos.z));
        });
    }

    public getCenterSymbolName(): string {
        for (const symbol of this.symbols) {
            const y = symbol.getPosition().y;
            if (Math.abs(y - 140) < 1) {
                return symbol.name;
            }
        }
        return '';
    }

    public isSpinning(): boolean {
        return this.spinning;
    }
}
