const { useEffect } = require("react")
import axios from 'axios'

function majelistaklim(){

    useEffect(()=>{
        const fetchData = async() =>{
            try{
            const response = axios.get('')
            } catch(err){
                console.log(err)
            }
        }
        fetchData();
    }, [])

    return (
        <div>
            <div>
                <button>

                </button>
                <table>
                    <thead>
                        <tr>
                            <th>nama</th>
                            <th>alamat</th>
                            <th>nohp</th>
                        </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
    )
}