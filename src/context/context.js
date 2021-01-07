import React, { useState, useEffect } from 'react';
import mockUser from './mockData.js/mockUser';
import mockRepos from './mockData.js/mockRepos';
import mockFollowers from './mockData.js/mockFollowers';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

export const GithubContext=React.createContext();

export const GithubProvider = ({children}) =>{
    const [githubUser,setGithunUser]=useState(mockUser)
    const [repos,setRepos]=useState(mockRepos)
    const [followers,setFollowers]=useState(mockFollowers)
    // request loading
    const [requests,setRequests]= useState(0);
    const [isLoading,setIsLoading]=useState(false)
    //error
    const [error,setError]=useState({show:false,msg:''})

    const searchGithubUser = async(user) =>{
        toggleError()
        setIsLoading(true)
        const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
        console.log(err)
        )
        if(response){
            setGithunUser(response.data)
            const { login, followers_url } = response.data;
        }
    }

    const checkRequests = () =>{
        axios(`${rootUrl}/rate_limit`)
        .then(({data})=>{
            let {
                rate: { remaining },
              } = data;
              setRequests(remaining)
              if(remaining === 0){
                  toggleError(true,'sorry, you have exceeded your hourly rate limit!')
              }
        }).catch((err)=>console.log(err))
    }
    function toggleError(show=false,msg=''){
        setError({show,msg})
    }

    useEffect(checkRequests, []);

    return(
        <GithubContext.Provider value={{githubUser,repos,followers}} >
        {children}
        </GithubContext.Provider>
    )
}
