import axios from "axios";

class ApiService{
    static SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5050';

    // PostQuestion
    static postQuestion (question, knowledgebase, count){
        const url = `${this.SERVER_URL}/api/question`
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post(
                    url,
                    {
                        question,
                        'sessionId': sessionStorage.getItem('sessionId'),
                        dialogCount: count
                    },
                    {
                        params: {
                            'kbase': knowledgebase
                        }
                    }
                );
                if (res.status === 208){
                    return reject({code: 1, message: 'No fitting answer found.'})
                }
                resolve(res.data);
            } catch (e) {
                reject({code: 2, message: e});
            }
        })
    }

    // Get Reference
    static getReferenceFromAzure(qnaId){
        const url = `${this.SERVER_URL}/api/question`;
        return new Promise(async (resolve, rejecet) => {
            try {
                const res = await axios.post(
                    url,
                    {
                        qnaId
                    },
                    {
                        params:{
                            'kbase': 'azure'
                        }
                    }
                );
                resolve(res.data);
            } catch (e) {
                console.log(e);
                rejecet(e);
            }
        })
    }
}

export default ApiService;