import Main from './src/Main'
import {YellowBox} from 'react-native'

YellowBox.ignoreWarnings([
    'Possible Unhandled Promise Rejection',
    'Remote debugger'
])

import Amplify from 'aws-amplify'
import config from './aws-exports'

Amplify.configure(config)

// function App() {
//   const [user, updateUser] = React.useState(null);
//   React.useEffect(() => {
//     Auth.currentAuthenticatedUser()
//         .then(user => updateUser(user))
//         .catch(() => console.log('No signed in user.'));
//     Hub.listen('auth', data => {
//       switch (data.payload.event) {
//         case 'signIn':
//           return updateUser(data.payload.data);
//         case 'signOut':
//           return updateUser(null);
//       }
//     });
//   }, [])
//   if (user) {
//     return (
//         Main
//     )
//   }
//   return (
//       <div style={{ display: 'flex', justifyContent: 'center' }}>
//         <AmplifyAuthenticator>
//           <AmplifySignUp
//               slot="sign-up"
//               formFields={[
//                 { type: "username" },
//                 {
//                   type: "password",
//                   label: "Custom Password Label",
//                   placeholder: "custom password placeholder"
//                 },
//                 { type: "email" }
//               ]}
//           />
//         </AmplifyAuthenticator>
//       </div>
//   );
// }

export default Main