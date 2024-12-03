import { useState } from 'react';

//handles all machines
function MachineCards({machines, joinSeen, toggleJoinPopup})
{
  const cards = []
  machines.forEach((machine) => {
    cards.push(
      <Card machine={machine} joinSeen={joinSeen} toggleJoinPopup={toggleJoinPopup}/>
    )
  })
  return (
    <div class="machine-cards">
      {cards}
    </div>
  )
}

//one machine card (machine name, join button, list of users waiting)
function Card({ machine, joinSeen, toggleJoinPopup})
{
  let collapsible_text = machine.waitlist.length + " people waiting..."
  let estimated_time = machine.waitlist.length * 15 + " minutes"; 
  if(machine.waitlist.length == 0)
  {
    collapsible_text = "Waitlist is empty"
    estimated_time = "";
  }

  return (
    <div class="card">
        <div class="card-title">
          {machine.name}
            <button type="button" class="join-waitlist-button" onClick = {toggleJoinPopup}>
              Join Waitlist
            </button>
            {joinSeen ? <JoinWaitlist toggle={toggleJoinPopup} /> : null}
        </div>
        <div class="collapsible"> {/* todo: implement collapsible button, right now does nothing */}
          <button type="button" class="collapsible-button">
              <div class="collapsible-description">
              {collapsible_text}
              </div>
              <div class="collapsible-est-time">
              {estimated_time}
              </div>
          </button>
          <div>
            <CardList waitlist={machine.waitlist}/>
          </div>
        </div>
      </div>
  );
}

//list of users waiting inside the card (list of usernames + est time)
function CardList({waitlist})
{
    if(waitlist.length == 0)
    {
        return (<div></div>)
    }

    const table_rows = [];
    for (let i = 0; i < waitlist.length; i++)
    {
      table_rows.push(
        <tr key={i}>
          <td>
            {waitlist[i]}
          </td>
        </tr>
      )
    } 

    return (
      <table>
          {table_rows}
      </table>
    );
}

//sign up popup
function SignUp(props)
{
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')

  function handleSignUp(e) {
      e.preventDefault()
      //handle signup
      if(password !== confirmPassword)
        console.error("The two passwords do not match. Try again.");
            
      const userData = { username, password, email };
      try {
        // make the post request to /signup 
        const response = await fetch('/signup', {
          method: 'POST', // HTTP method
          headers: {
            'Content-Type': 'application/json', // we are sending JSON
          },
          body: JSON.stringify(userData), // converts the data to a JSON string
        });
        const data = await response.json(); 
        if (response.ok) {
          console.log('Signup successful', data); 
        } else {
          console.error('Error during signup:', data.message); 
        }
      } catch (error) {
        console.error('Network or server error:', error); 
      }
      //props.toggle()
  }

  //todo: test that passwords match, add display/hide password functionality 
  return (
      <div className="popup">
          <div className="popup-inner">
              <h2>Sign Up</h2>
              <button className="close-button-top-right" onClick={props.toggle}>
                <span class="material-symbols-outlined">close</span>
              </button>
              <form onSubmit={handleLogin}>
                  <label>
                      Username:
                      <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                  </label>
                  <label>
                      Email:
                      <input type="text" value={email} onChange={e => setEmail(e.target.value)} />
                  </label>
                  <label>
                      Password:
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                  </label>
                  <label>
                      Confirm password:
                      <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} />
                  </label>
                  <button type="submit">Login</button>
              </form>
          </div>
      </div>
  )
}

//login popup
function Login(props) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  function handleLogin(e) {
      e.preventDefault()
      // handle login
      props.toggle()
  }

  return (
      <div className="popup">
          <div className="popup-inner">
              <h2>Login</h2>
              <button className="close-button-top-right" onClick={props.toggle}>
              <span class="material-symbols-outlined">close</span>
              </button>
              <form onSubmit={handleLogin}>
                  <label>
                      Username:
                      <input type="text" value={username} onChange={e => setUsername(e.target.value)} />
                  </label>
                  <label>
                      Password:
                      <input type="password" value={password} onChange={e => setPassword(e.target.value)} />
                  </label>
                  <button type="submit">Login</button>
              </form>
          </div>
      </div>
  )
}

//join waitlist popup 
function JoinWaitlist(props) {
  //number of sets + total estimated time 
  const [numberOfSets, setNumberOfSets] = useState(1)
  const [estTime, setEstTime] = useState(0)

  async function handleJoinWaitlist(e) {
      e.preventDefault();
      const desiredEquipmentName = 'Example Equipment';  // will update this once we handle the equipment name when you signup
      //const token = localStorage.getItem('token'); // if JWT token in localStorage
      //handle joining waitlist
       try {
      // Validate user input
      if (!userId || !desiredEquipmentName) {
        setMessage('Please provide a valid user ID and equipment name');
        return;
      }

      // Send the POST request to the backend
      const response = await fetch('/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Tell the backend you're sending JSON data
          //'Authorization': `Bearer ${token}`, // Send the JWT token in the Authorization header
        },
        body: JSON.stringify({ name: desiredEquipmentName }), // Send the desired equipment name
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Successfully joined the waitlist');
      } else {
        setMessage(data.message || 'Something went wrong');
      }
    } catch (error) {
      console.error('Error joining waitlist:', error);
      setMessage('An error occurred. Please try again later.');
    }
    
      props.toggle()
    
  }

  const maxNumberOfSets = 5; //arbitrary number for now
  const setElements = [];
  for (let i = 1; i < maxNumberOfSets+1; i++)
  {
    setElements.push(
      <option value={i}>{i}</option>
    )
  }

  return (
      <div className="popup">
          <div className="popup-inner">
              <h2>Join Waitlist</h2>
              <button className="close-button-top-right" onClick={props.toggle}>
              <span class="material-symbols-outlined">close</span>
              </button>
              <form onSubmit={handleJoinWaitlist}>
                  <label>
                      Number of Sets:
                      <select value={numberOfSets} onChange={e => setNumberOfSets(parseInt(e.target.value))}>
                        {setElements}
                      </select>
                  </label>
                  <button type="submit">Join Waitlist</button>
              </form>
          </div>
      </div>
  )
}

export default function App() {
  const [joinSeen, setJoinSeen] = useState(false)
  const [loginSeen, setLoginSeen] = useState(false)
  const [signUpSeen, setSignUpSeen] = useState(false)

  function toggleJoinPopup () {
    setJoinSeen(!joinSeen);
  };

  function toggleLoginPopup () {
    setLoginSeen(!loginSeen);
  };
  
  function toggleSignUpPopup () {
    setSignUpSeen(!signUpSeen);
  };

  return(
  <body>
    <div class="header">
      <div class="topnav">
        {/*<topnav-icon><img src="" alt="logo" width="30" height="30"></img></topnav-icon> <-- placeholder for logo, if we want*/} 
        <div class="topnav-icon"><span class="material-symbols-outlined">fitness_center</span></div>
        <div class="topnav-appname">Bruin Wait-Lifting</div>
        <div class="topnav-buttons" onClick={toggleLoginPopup}>
          Login
        </div>
  
        {loginSeen ? <Login toggle={toggleLoginPopup} /> : null}
        <div class="topnav-buttons" onClick={toggleSignUpPopup}>
          Sign up
        </div>
        {signUpSeen ? <SignUp toggle={toggleSignUpPopup} /> : null}
      </div>
    </div>
    <MachineCards machines = {MACHINES} joinSeen={joinSeen} toggleJoinPopup={toggleJoinPopup}/>
  </body>
  );


}

//fake data
const MACHINES = [
  {name: "Treadmill 1", waitlist: ["username1", "username2", "username3"]},
  {name: "Treadmill 2", waitlist: []},
  {name: "Smith Machine", waitlist: ["username1", "username2"]},
];
