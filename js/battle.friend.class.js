class FriendBattle {
    constructor(conn) {
        this.conn = conn;
        this.isMyTurn = false;
        this.iamReady = false;
        this.friendReady = false;
        this.asked = false;
    }

    next() {
        this.isMyTurn = !this.isMyTurn;
    }
}
