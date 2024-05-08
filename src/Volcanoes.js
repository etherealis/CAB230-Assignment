import React, { useState, useEffect } from "react"
import { Map, Marker } from "pigeon-maps"
import { Table, Cascader, Button, Modal, Select } from 'antd'
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, Legend, LinearScale,
  BarElement, Title, Tooltip } from 'chart.js'

  import { useGetCountryAndVolcanoes, useGetVolcanoDetails } from "./hooks"

Chart.register(CategoryScale, LinearScale,
BarElement, Title, Tooltip, Legend)

export default function VolcanoListPage ({setBackground}) {
  const token = localStorage.getItem("token")
  const { countriesList, selectedCountry, 
          setSelectCountry, volcanoesList, 
          populationDist, setPopulationDist 
        } = useGetCountryAndVolcanoes()

  useEffect(() => {
    setBackground(1)
  }, [])

  const handleResetClick = () => {
    setSelectCountry(null)
    setPopulationDist("-")
  }

  const DisplayTable = () => {
    
      // create volcano objects
      let volcano_copy = Array.from(volcanoesList)
      volcano_copy.forEach((v, i) => {
        const volcano_dict = {
            key: v.country,
            name: v.name,
            region: v.region,
            subregion: v.subregion,
            action: v.id
        }
        volcano_copy[i] = volcano_dict
      })

      return <Table 
              id="volcano-table"
              pagination={{ 
                defaultPageSize: "5", 
                pageSizeOptions: ["5", "10"],
                responsive: true,
                size: "small"  
              }} 
              rowKey={row => row.action} 
              dataSource={volcano_copy}>
          <Table.Column title="Location" dataIndex="name" key="name"/>
          <Table.Column title="Region" dataIndex="region" key="region" />
          <Table.Column title="Subregion" dataIndex="subregion" key="subregion"/>
          <Table.Column dataIndex="action" key="action"
              render={id => <VolcanoDetailsPage id={id} token={token}/>}/>
      </Table>
  }

  const DisplayCascaderSorting = () => {
      let cascade_options = []
      let cascade_indexes = []

      // get distinct first letters 
      countriesList.forEach(c => {
          let country_start_letter = String(c[0]).toUpperCase()
          if(cascade_options.findIndex(o => o.value == country_start_letter) == -1) {
              let cascade_option = {
                  value: country_start_letter,
                  label: country_start_letter,
                  children: []
              }
              cascade_options.push(cascade_option)

              let o_index = country_start_letter
              cascade_indexes.push(o_index)
          }
      })

      // save countries under cascade option children
      countriesList.forEach(c => {
          let country_start_letter = String(c[0]).toUpperCase()
          let country_index = cascade_indexes.indexOf(country_start_letter)
          let country_dict = { value: c, label: c }
          cascade_options[country_index].children.push(country_dict)
      })
      
      const filter = (inputValue, path) => 
        path.some((option) => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1)

      return (
        <div>
          Select a country: &nbsp;
          <Cascader 
            id="dropdown"
            allowClear={false}
            placeholder="Select or type"
            value={selectedCountry}
            options={cascade_options} 
            showSearch={{filter}}
            onChange={(v) => setSelectCountry(v[1]) }
          /> &nbsp;             
          {token?
            <span>
              Populated within: &nbsp;   
              <Select
              style={{width:80}}
              value={populationDist}
              options={[{ value: '-', label: '-'},
                { value: '5km', label: '5km'},
                { value: '10km', label: '10km'}, 
                { value: '30km', label: '30km'},
                { value: '100km', label: '100km'}]}
              onSelect={val => setPopulationDist(val)}
            />
            </span>
            : null
          } &nbsp;
          <Button className="buttons"onClick={handleResetClick}>Reset</Button>
        </div>)
  }

  return (
      <div>
          <h2>Volcanoes List</h2><br/>
          <DisplayCascaderSorting/><br/>
          <DisplayTable />            
      </div>
  );
}

function VolcanoDetailsPage({id, token}) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoggedIn, selectedVolcano] = useGetVolcanoDetails(id, token)

  const DisplayMap = () => {
    const color = `hsl(${10}deg 39% 70%)`
    let lat_lng = [Number(selectedVolcano.latitude),Number(selectedVolcano.longitude)]
    return <Map height={200} center={lat_lng} defaultZoom={4}>
    <Marker width={50} anchor={lat_lng} color={color}  />
  </Map>
  }

  const GetChartProps = () => {
    const options = {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Population Density',
        },
      },
    };

    const data = {
      labels: ["5km", "10km", "30km", "100km"],
      datasets: [{ 
          label: 'Inhabitants',
          data: [
            selectedVolcano.population_5km, 
            selectedVolcano.population_10km, 
            selectedVolcano.population_30km, 
            selectedVolcano.population_100km
          ],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
      }]
    }
    return [options, data]
  }

  return (
    <div>
      <Button className="buttons" onClick={() => setIsOpen(true)}>View</Button>
      <Modal
        id="volcano-modal"
        title={"Location: " + selectedVolcano.name}
        centered={true}
        open={isOpen}
        onOk={() => setIsOpen(false)}
        cancelText="Close"
        onCancel={() => setIsOpen(false)}
        width="40%">
          <hr align="left" width="50%" />
          <p>
            Last Eruption: {selectedVolcano.last_eruption}<br/>
            Summit: {selectedVolcano.summit} m<br/>
            Elevation: {selectedVolcano.elevation} ft
          </p>
          <h4>Geography<hr align="left" width="25%"/></h4>
          <p>
            Country: {selectedVolcano.country} <br/>
            Region: {selectedVolcano.region}<br/>
            Subregion: {selectedVolcano.subregion}<br/><br/>
            <DisplayMap />
          </p>
          {isLoggedIn? 
            <span style={{display: "block", marginLeft: "auto", marginRight: "auto"}} ><hr/>
            <br/>
              <Bar options={GetChartProps()[0]} data={GetChartProps()[1]} />
            </span>
            : null
          }
      </Modal>
    </div>
  )
}