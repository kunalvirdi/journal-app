const jwt = require("jsonwebtoken");
const Journal = require('../model/journals')
const TaggedJournal = require('../model/tagged_journals')
const Student = require('../model/students')
const Teacher = require('../model/teachers')
const {uploadFileToS3, deleteFileFromS3} = require('../awsS3Service')
const addToTaggedJournals = async (studentId, journal_id) => {
    let taggedJournal;
    taggedJournal = new TaggedJournal(studentId, journal_id);
    await taggedJournal.save();
}

module.exports.getJournals = (req, res) => {
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            res.status(401).json({message: "Invalid Token"});
        } else {
            // We have to check if user is student or teacher then according to this we have to send data
            if (user.role === "student") {
                const [data] = await Student.getTaggedJournals(user.userId);
                res.status(200).json({Tagged_Journals: data, username: user.username})
            } else {
                const [data] = await Teacher.getCreatedJournals(user.userId)
                res.status(200).json({Created_Journals: data, username: user.username});
            }
        }
    })
}

module.exports.createJournal = (req, res) => {
    //Verify Token sent by user
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            res.status(401).json({message: "Invalid Token"})
        } else {
            //If user is student then we revoke the access of creation
            if (user.role === "student") {
                res.status(403).json({message: "Students cannot Post Journals..."})
            } else {
                // We get the details of journal and add to tagged_journals and journals
                const journal_id = req.body.id, description = req.body.desc, user_id = user.userId,
                    taggedStudents = req.body.taggedStudents.split(','), url = req.body.url;
                let attachment;

                //If teacher attached file then we have to upload it on AWS S3
                if (req.file) {
                    await uploadFileToS3(req.file, user.userId);
                    attachment = `${process.env.AWS_BUCKET}/${user.userId + '-' + req.file.originalname}`;
                }
                const journal = new Journal(journal_id, description, user_id, url, attachment);
                try {
                    await journal.save();
                    taggedStudents.map((studentId) => {
                        addToTaggedJournals(studentId, journal_id);
                    })
                    res.status(201).json(`Added journal with ${journal_id} in database and tagged to ${taggedStudents}`);
                } catch (err) {
                    res.status(406).json(err.message);
                }
            }
        }
    })
}

module.exports.deleteJournals = (req, res) => {
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            res.status(401).json({message: "Invalid Token"})
        } else {
            //If user is student then we revoke the access of deletion
            if (user.role === "student") {
                res.status(403).json({message: "Students cannot delete any Journal..."})
            } else {
                const [attachmentPath] = await Journal.getAttachmentPath(req.body.journal_id);
                const attachment = attachmentPath[0].attachment;
                if (attachment !== " ") {
                    await deleteFileFromS3(attachment.split('/')[1])
                }
                try{
                    await Journal.deleteJournal(req.body.journal_id);
                    res.status(200).json(`Deleted journal with ${req.body.journal_id} successfully`);
                }catch(err){
                    res.json(err)
                }

            }
        }
    })
}

module.exports.updateJournal = (req, res) => {
    jwt.verify(req.token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
        if (err) {
            res.status(401).json({message: "Invalid Token"})
        } else {
            //If user is student then we revoke the access of deletion
            if (user.role === "student") {
                res.status(403).json({message: "Students cannot update any Journal..."})
            } else {
                try {
                    await Journal.updateJournal(req.body.journal_id, req.body.description);
                    res.status(201).json({message: `Upadated ${req.body.journal_id} successfully`});
                } catch (err) {
                    res.status(406).json(err.message);
                }
            }
        }
    })
}

