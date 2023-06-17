const db=require('../util/database')
module.exports=class User{
    constructor(id,username,password,role,email) {
        this.id=id;
        this.username=username;
        this.password=password;
        this.role=role;
        this.email=email
    }

    save(){
        return db.execute("INSERT INTO users(user_id,username,password,role,email) VALUE(?,?,?,?,?)",
            [this.id,this.username,this.password,this.role,this.email])
    }

    static findUser(username){
        return db.execute("SELECT * FROM users where username = ?",[username]);
    }
}