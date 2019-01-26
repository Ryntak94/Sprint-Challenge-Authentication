import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import styled from 'styled-components';
import { Route } from 'react-router-dom';
import axios from 'axios';

const Container = styled.div`
    width: 300px;
    height: 250px;
    border: solid 1px black;
    margin: 30px auto;
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Input = styled.input`
    width: 150px;
    height: 25px;
    margin: 10px;
`
const Title = styled.h1``

const Submit = styled.div`
    width: 100px;
    height: 40px;
    border: solid 1px black;
    border-radius: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
`

class SignIn extends Component   {
    constructor(props)  {
        super(props)
        this.state = {
            username: "",
            password: "",
        }
    }

    onChangeHandler =   ({target})  =>  {
        this.setState((state)   =>  ({
            [target.name]: target.value,
        }))
    }

    onClickHandler = () =>  {
        axios.post('http://localhost:3300/api/login',   {username: this.state.username, password: this.state.password})
            .then(response  =>  {
                localStorage.setItem('jwt', response.data.token)
            })
            .then(()    =>  {
                this.props.history.push('/jokes');
            })
    }

    render()    {
        return(
            <Container>
            <Title>Sign In</Title>
                <Input placeholder="Username" onChange={this.onChangeHandler} name="username" value={this.state.username} />
                <Input placeholder="Password" type="password" onChange={this.onChangeHandler} name="password" value={this.state.password} />
                <Submit onClick={this.onClickHandler}>Submit</Submit>
            </Container>
        )
    }
}

class SignUp extends Component   {
    constructor(props)  {
        super(props)
        this.state = {
            username: "",
            password: "",
        }
    }

    onChangeHandler =   ({target})  =>  {
        this.setState((state)   =>  ({
            [target.name]: target.value,
        }))
    }

    onClickHandler = () =>  {
        axios.post('http://localhost:3300/api/register',   {username: this.state.username, password: this.state.password})
            .then(response  =>  {
                localStorage.setItem('jwt', response.data.token)
            })
            .then(()    =>  {
                this.props.history.push('/jokes');
            })
    }

    render()    {
        return(
            <Container>
            <Title>Sign Up</Title>
                <Input placeholder="Username" onChange={this.onChangeHandler} name="username" value={this.state.username} />
                <Input placeholder="Password" type="password" onChange={this.onChangeHandler} name="password" value={this.state.password} />
                <Submit onClick={this.onClickHandler}>Submit</Submit>
            </Container>
        )
    }
}

class Jokes extends Component   {
    constructor(props)  {
        super(props)
        this.state = {
            jokes: [],
            err: ""
        }
    }
    componentDidMount() {
        const token = localStorage.getItem('jwt');
        const config = {
            headers:    {
                authorization: token
            }
        }
        axios.get('http://localhost:3300/api/jokes', config)
            .then(response  =>  {
                this.setState((state)   =>  ({
                    jokes: response.data,
                    err: ""
                }))
            }).catch(err    =>  {
                this.props.history.push('/');
            })
    }

    render()    {
        return(
            <div>
            {this.state.jokes.map(joke  =>  {
                return <div>{joke.joke}</div>
            })}
            </div>
        )
    }
}

class App extends Component {
    onClickHandler = () =>  {
        localStorage.removeItem('jwt');
        console.log("cleared");
    }
  render() {
    return (
      <div className="App">
      <div onClick={this.onClickHandler}>Clear Token</div>
        <Route exact path="/" render={(props)   =>  <SignIn {...props}/>} />
        <Route exact path="/signin" render={(props)   =>  <SignIn {...props}/>} />
        <Route exact path="/signup" render={(props)   =>  <SignUp {...props}/>} />
        <Route exact path="/jokes" render={(props)   =>  <Jokes {...props}/>} />
      </div>
    );
  }
}

export default App;
