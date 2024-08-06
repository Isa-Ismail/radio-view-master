import axios from "axios";

export const clinicianEndpoint = 'https://user-auth-dev.radioview.ai/api/v1/neuroich/clinician/'
export const guestLoginEndpoint = 'https://user-auth-dev.radioview.ai/api/v1/neuroich/guest_user/guest_login/'


const clinicianAxiosClient = axios.create({
  baseURL: 'https://neuroich-user-auth.neurocare.ai/api/v1/neuroich/clinician/',
  timeout: 10000, // Adjust the timeout as needed
  headers: {
    'Content-Type': 'application/json',
  },
});

export default clinicianAxiosClient;