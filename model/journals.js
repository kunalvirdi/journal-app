const db=require('../util/database')
const {uploadFileToS3}= require('../awsS3Service')
module.exports=class Journals{
    constructor(id,description,createdBy,url,attachment) {
        this.journal_id=id;
        this.description=description;
        this.createdBy=createdBy;
        this.attachment=attachment?attachment:" ";
        this.url=url?url:" ";
    }

    async save(){
        return db.execute("INSERT INTO journals(journal_id,description,attachment,url,createdBy) values(?,?,?,?,?)",[this.journal_id,this.description,this.attachment,this.url,this.createdBy]);
    }
    static deleteJournal(journal_id){
        return db.execute('DELETE FROM journals where journal_id=?',[journal_id]);
    }
    static getAttachmentPath(journal_id){
        return db.execute('SELECT attachment from journals where journal_id=?',[journal_id])
    }
    static updateJournal(journal_id,description,attachment=" ",url=" "){
        return db.execute('UPDATE journals SET description=?, attachment=?, url=? where journal_id=?',[description,attachment,url,journal_id])
    }
}