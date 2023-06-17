const db=require('../util/database')
module.exports=class Teacher{
    constructor(id,username,email) {
        this.teacher_id=id;
        this.username=username;
        this.email=email
    }

    save(){
        return db.execute("INSERT INTO teachers VALUE(?,?,?)",
            [this.teacher_id,this.username,this.email])
    }
    static getCreatedJournals(userId){
        const queryPart1='SELECT j.journal_id, j.description,j.attachment, j.url, j.createdAt from teachers';
        const queryPart2=' INNER JOIN journals j on teachers.teacher_id=j.createdBy where teachers.teacher_id=?'
        return db.execute(queryPart1+queryPart2,[userId])
    }
}