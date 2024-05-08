import React, { useState, useEffect } from "react";

const API_URL = "http://4.237.58.241:3000"

export function useGetCountryAndVolcanoes() {
    const [countriesList, setCountriesList] = useState([])
    const [volcanoesList, setVolcanoesList] = useState([])
    const [selectedCountry, setSelectCountry] = useState()
    const [populationDist, setPopulationDist] = useState("-")
  
    useEffect(() => {
        fetch(`${API_URL}/countries`)
        .then(response => response.json())
        .then(result => {
            setCountriesList(result)
        }).catch(e => errorHandler(e))
    }, [])
  
    useEffect(() => {
        const COUNTRY_URL = API_URL + `/volcanoes?country=${selectedCountry}`
        const POPULATED_URL = API_URL + `/volcanoes?country=${selectedCountry}&populatedWithin=${populationDist}`

        if(populationDist == "-") {
            fetch(COUNTRY_URL)
            .then(response => response.json())
            .then(result => setVolcanoesList(result))
        } else {
            fetch(POPULATED_URL)
            .then(response => response.json())
            .then(result => setVolcanoesList(result))
        }
        
    }, [selectedCountry, populationDist])

    return { countriesList, selectedCountry, setSelectCountry, 
        volcanoesList, populationDist, setPopulationDist }
}

export function useGetVolcanoDetails(id, token) {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [selectedVolcano, setSelectVolcano] = useState({})
  
    useEffect(() => {
      if(!token){
        fetch(`${API_URL}/volcano/${id}`)
        .then(response => response.json())
        .then(result => {
            setSelectVolcano(result)
        }).catch(e => errorHandler(e))
      } else {
        const requestOptions = {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        }}
  
        fetch(`${API_URL}/volcano/${id}`, requestOptions)
        .then(response => response.json())
        .then(result => {
            setSelectVolcano(result)
        }).catch(e => errorHandler(e))
        setIsLoggedIn(true)
      }
    }, [])

    return [isLoggedIn, selectedVolcano]
}

export const errorHandler = (e) => {
  if (e.status === 400) {
      throw new Error('400, Bad Request Sent');}
  if (e.status === 404) {
      throw new Error('404, Not Found');}
  if (e.status === 500) {
      throw new Error('500, Internal Server Error');}
  // For any other server error
  throw new Error(e.status);
}