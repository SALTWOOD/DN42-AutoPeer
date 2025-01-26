export class Peer {
    public as: number;
    public address: string;
    public port: number;
    public publicKey: string;

    public constructor() {
        this.as = 4242420000;
        this.address = "address.to.your.node";
        this.port = 20000;
        this.publicKey = "Your WireGuard public key here";
    }
}