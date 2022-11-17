import axios from "axios";

class ApiService{
    static SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5050';
    // PostQuestion
    static postQuestion (question, knowledgebase){
        console.log(import.meta.env.VITE_SERVER_URL);
        const url = `${this.SERVER_URL}/api/question`
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post(
                    url,
                    {
                        question
                    },
                    {
                        params: {
                            'kbase': knowledgebase
                        }
                    }
                );
                resolve(res.data);
            } catch (e) {
                reject(e);
            }
        })
    }

    // Test API
    static postTest(){
        const url = 'https://jsonplaceholder.typicode.com/posts'
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post(url,
                    {
                        title: 'fii',
                        body: 'asdasd',
                        userId: 1
                    },
                    {
                        headers: {
                            'Content-type': 'application/json; charset=UTF-8'
                        }
                    });
                resolve("Das hier ist eine ganz lange antwort, bitte lass es endlich funktionieren")
            } catch (e) {
                reject(e);
            }
        })
    }
}

export default ApiService;