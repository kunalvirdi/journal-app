const db=require('../util/database')

module.exports=class TaggedJournal{
    constructor(student_id,journal_id) {
        this.student_id=student_id;
        this.journal_id=journal_id
    }
    save(){
        return db.execute('INSERT INTO tagged_journals values(?,?)',[this.student_id,this.journal_id]);
    }
}