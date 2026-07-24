import { useState, useEffect, use } from "react";
import axios from "axios";

const EtablissementList = () => {

    const [data, setData] = useState([]);
    const api = "http://localhost:8080/api/etablissements"

    useEffect(() => {
      let mounted = true;

    (async () => {
        try {
            const result = await axios.get(api);
            if (mounted) setData(result.data);
        } catch (e) {
            console.log("Error", e)
        }
    })();
    
      return () => {
        mounted = false;
      }
    }, []);
    

  return (
    <>
        {Array.isArray(data) && data.map((etablissement, index) => (
            <div key={etablissement.id ?? index}>
                <div><strong>{etablissement.nom}</strong></div>
                <div>Type: {etablissement.type}</div>
                <div>Région: {etablissement.region}</div>
                <div>Téléphone: {etablissement.telephone}</div>
                <div>Adresse: {etablissement.adresse}</div>
                <hr />
            </div>
        ))}
    </>
  )
}

export default EtablissementList;