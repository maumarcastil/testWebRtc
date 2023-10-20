import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import axios from 'axios'
import { ws } from '../config/ws'
import { View } from 'react-native'
import { RoomContext } from '../context/RoomContext2'

export const Home = () => {
  const [firebaseToken] = useState("eyJhbGciOiJSUzI1NiIsImtpZCI6IjAzZDA3YmJjM2Q3NWM2OTQyNzUxMGY2MTc0ZWIyZjE2NTQ3ZDRhN2QiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoibWlndWVsIGRhbmllbCIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS90ZWNoY29tZXQtZGV2IiwiYXVkIjoidGVjaGNvbWV0LWRldiIsImF1dGhfdGltZSI6MTY5Nzc1NjIxMSwidXNlcl9pZCI6Ik16dU9qRzlVaDFmNUNXOXVkbVJvR0NpRlp4MTMiLCJzdWIiOiJNenVPakc5VWgxZjVDVzl1ZG1Sb0dDaUZaeDEzIiwiaWF0IjoxNjk3NzU2MjExLCJleHAiOjE2OTc3NTk4MTEsImVtYWlsIjoiY2Fwb3lhczYxMkBzdHlwZWRpYS5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJlbWFpbCI6WyJjYXBveWFzNjEyQHN0eXBlZGlhLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6InBhc3N3b3JkIn19.EIEvCWYIZOsCl7wPp4zlcTwc6QiMPjyXV_Z56_tWXwjBHKHNCpe0KVWAar1bg8PLXm1VeUVNT9jsQlnGKvNvH5d0PIkocz3LJpCTWA-9Uz9fMQNzQGhXW_iS0u1Ev-BhU_fOfOvf6DnavMJ7JikHiwMVIS5H0AeuTU053qdt0lTer3doWnSZ7t4OkCywzMB-MjWBdvfws-A6RioDg02M30IAQPR0U5kdBjLfleIg-0gL96_Dqg30L4xNbJOPrFhI9ry_xdOTjO0J4HbApVkf8_aZGLCMT9zDmNMe-7ZK8MV45jdhBbK8culhgDRvsVDCJ1w4gCUawFYx0LlYikw9xQ")
  const { token, setToken } = useContext(RoomContext);

  const createRoom = useCallback(() => {
    ws.emit("create-room", { token })
  }, [token])

  useEffect(() => {
    if (firebaseToken) {

      const url = process.env.REACT_APP_SERVER || "https://server-3j0t.onrender.com:443";
      axios.post(`${url}/auth/login`, {}, {
        headers: {
          Authorization: firebaseToken
        }
      }).then(response => {
        const data = response.data
        console.log({ parityData: data })
        setToken(data.token)
      }).catch(console.error)
    }
  }, [firebaseToken, setToken])

  useEffect(() => {
    if (token) {
      createRoom()
    }
  }, [token, createRoom, setToken])

  return (
    <View></View>
  )
}