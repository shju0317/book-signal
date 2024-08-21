const bcrypt = require('bcrypt');
const userDB = require('../models/userDB');

const textToHash = async (text) => {
    const saltRounds = 12;

    try {
        const hash = await bcrypt.hash(text, saltRounds);
        return hash;
    } catch (err) {
        console.error(err);
        throw err; 
    }
};

exports.join = async (req, res) => {
    const { mem_id, mem_pw, mem_name, mem_nick, mem_birth, mem_mail } = req.body;


    if (!mem_id || !mem_pw || !mem_name || !mem_nick || !mem_birth || !mem_mail) {
        return res.status(400).json({ message: '모든 정보를 입력해주시기 바랍니다.' });
    }

    try {
        const getUser = await userDB.getUser(mem_id);
        if (getUser.length) {
            res.status(401).json('이미 존재하는 아이디입니다.');
            return;
        }

        const hash = await textToHash(mem_pw);
        const signUp = await userDB.join({
            mem_id,
            mem_pw: hash,
            mem_name,
            mem_nick,
            mem_birth,
            mem_mail,
            mem_point: 0,
            enroll_at: new Date()
        });
        res.status(200).json('가입 성공');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: '서버 오류' });
    }
};

const hashCompare = async (inputValue, hash) => {
    try {
        const isMatch = await bcrypt.compare(inputValue, hash);
        if (isMatch) return true;
        else return false;
    } catch (err) {
        console.error(err);
        return err;
    }
};

exports.login = async (req, res) => {
    const { mem_id, mem_pw } = req.body;

    try {
        const getUser = await userDB.getUser(mem_id);
        if (!getUser.length) {
            res.status(401).json('존재하지 않는 아이디입니다.');
            return;
        }

        const isMatch = await hashCompare(mem_pw, getUser[0].mem_pw);

        if (!isMatch) {
            res.status(401).json('비밀번호가 일치하지 않습니다.');
            return;
        }
        res.status(200).json('로그인 성공');
        
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
};

// 이메일 중복 체크 함수
exports.getUserByEmail = async (mem_email) => {
    try {
        const getUser = await userDB.getUserByEmail(mem_email);
        return getUser;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// 닉네임 중복 체크 함수
exports.getUserByNick = async (mem_nick) => {
    try {
        const getUser = await userDB.getUserByNick(mem_nick);
        return getUser;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

// 아이디 중복 체크 함수
exports.getUserId = async (mem_id) => {
    try {
        const getUser = await userDB.getUserId(mem_id);
        return getUser;
    } catch (err) {
        console.error(err);
        throw err;
    }
};