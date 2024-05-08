import React, { useEffect } from "react";

export default function MainPage ({setBackground}) {

    useEffect(() => {
        setBackground(0)
    }, [])

    return (
        <div>
            <h2>Welcome to Volcanoes Exploration App!</h2>
            <p>
                Whether you're a seasoned geology enthusiast or simply curious about these 
                awe-inspiring mountains of fire, this website is your one-stop shop for 
                everything volcanoes. Dive deep into the geographical features and exciting 
                details of the incredible forces that shape our planet. 
            </p>
        </div>
    )
}