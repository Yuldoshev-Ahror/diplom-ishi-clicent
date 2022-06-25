import React, { useEffect, useState } from 'react'
import Header from '../header'
import ErrorIndicator from '../error-indicator'
import Footer from '../footer'
import { FaMapMarkerAlt } from 'react-icons/fa'
import DeleverService from '../../services/delever-service'
import BranchInfo from '../branch-info'
import BranchMap from '../branch-map'

const Branches = ({ location }) => {
  const [branches, setBranches] = useState([{
    name: "Yunsobod",
    address: "Yunsobod, 23",
    location: {
      long: 41.31,
      lat: 69.31
    }
  }])
  const [branchInfo, setBranchInfo] = useState(null)
  const [mapState, setMapState] = useState({
    center: [41.31, 69.31],
    zoom: 12,
  })

  useEffect(() => {
    new DeleverService()
      .getBranch()
      .then((res) => {
        setBranches(res.branches)
      })
      .catch((error) => {
        console.log(error)
      })
  }, [])

  const goToMap = (val) => {
    setBranchInfo(val)

    setMapState({ center: [val.location.lat, val.location.long], zoom: 12 })
  }

  // if (!location) return <ErrorIndicator />
  return (
    <>
      <Header />
      <section className='section_container' id='top'>
        <div className='branches_list'>
          {branches
            ? branches.map((branch, i) => (
                <a
                  className='branch_card'
                  key={i}
                  name={branch.name}
                  href='#map'
                  onClick={() => goToMap(branch)}
                >
                  <div className='name'>
                    <h3>{branch.name}</h3>
                  </div>
                  <div className='address'>{branch.address}</div>
                  <div className='time'>
                    <p>Часы работы:</p>
                    <p>Ежедневно: 10:00 &mdash; 03:00</p>
                  </div>
                  <div className='location'>
                    <FaMapMarkerAlt />
                  </div>
                </a>
              ))
            : ''}
        </div>
      </section>
      {branches ? (
        <section className='map_block map_desc' id='map'>
          <div className='branches_content'>
            <BranchMap
              mapState={mapState}
              setBranchInfo={setBranchInfo}
              branches={branches}
            />
            {branchInfo ? (
              <BranchInfo
                data={branchInfo}
                closeInfo={() => setBranchInfo(null)}
              />
            ) : (
              ''
            )}
          </div>
        </section>
      ) : (
        ''
      )}
      <Footer />
    </>
  )
}

export default Branches
