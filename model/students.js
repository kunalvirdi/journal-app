const db = require('../util/database')
module.exports = class Teacher {
    constructor(id, username, email) {
        this.student_id = id;
        this.username = username;
        this.email = email
    }

    save() {
        return db.execute("INSERT INTO students VALUE(?,?,?)",
            [this.student_id, this.username, this.email])
    }

    static getTaggedJournals(userId) {
        const queryPart1="SELECT j.journal_id, j.description, j.attachment, j.url, j.createdAt from students st INNER JOIN tagged_journals tj ON st.student_id=tj.student_id";
        const queryPart2=" INNER JOIN journals j ON j.journal_id=tj.journal_id WHERE st.student_id=?"
        return db.execute(queryPart1+queryPart2, [userId])
    }
}