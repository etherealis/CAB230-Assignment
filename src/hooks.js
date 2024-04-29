import React, { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL

export function useGetCountryAndVolcanoes() {
    const [countriesList, setCountriesList] = useState([])
    const [volcanoesList, setVolcanoesList] = useState([])
    const [selectedCountry, setSelectCountry] = useState()
    const [populationDist, setPopulationDist] = useState("-")
  
    useEffect(() => {
        fetch(`http://4.237.58.241:3000/countries`)
        .then(response => response.json())
        .then(result => {
            setCountriesList(result)
        }).catch(e => errorHandler(e))
        
        return () => {
      
        }
    }, [])
  
    useEffect(() => {
        const COUNTRY_URL = API_URL + `/volcanoes?country=${selectedCountry}`
        const POPULATED_URL = API_URL + `/volcanoes?country=${selectedCountry}&populatedWithin=${populationDist}`

        if(populationDist == "-") {
            fetch(COUNTRY_URL)
            .then(response => response.json())
            .then(result => setVolcanoesList(result))
            console.log(populationDist)
        } else {
            fetch(POPULATED_URL)
            .then(response => response.json())
            .then(result => setVolcanoesList(result))
            console.log(populationDist)
        }
        
    }, [selectedCountry, populationDist])

    return { countriesList, selectedCountry, setSelectCountry, 
        volcanoesList, populationDist, setPopulationDist }
}


export const errorHandler = (e) => {
    // Custom message for failed HTTP codes
  if (e.status === 400) {
      throw new Error('400, Bad Request Sent');}
  if (e.status === 404) {
      throw new Error('404, Not Found');}
  if (e.status === 500) {
      throw new Error('500, Internal Server Error');}
  // For any other server error
  throw new Error(e.status);
}