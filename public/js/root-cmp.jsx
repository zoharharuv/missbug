const Router = ReactRouterDOM.HashRouter
const { Route, Switch } = ReactRouterDOM

import { userService } from "./services/user.service.js"

import { Navbar } from "./cmps/Navbar.jsx"
import { BugApp } from "./pages/BugApp.jsx"
import { BugDetails } from "./pages/BugDetails.jsx"
import { LoginPage } from "./pages/LoginPage.jsx"
import { UserDetails } from './pages/UserDetails.jsx';
import { UserTable } from './pages/UserTable.jsx';

export class App extends React.Component {
    state = {
        user: null
    }
    componentDidMount() {
        const user = userService.getLoggedinUser()
        this.setState({ user });
    }

    login = async (credentials) => {
        const user = await userService.login(credentials)
        this.setState({ user })
    }

    signup = async (credentials) => {
        const user = await userService.signup(credentials)
        this.setState({ user })
    }

    onLogout = async () => {
        await userService.logout()
        this.setState({ user: null, is_admin: false })
    }

    render() {
        const { user } = this.state;
        return (
            <Router>
                <Navbar user={user} onLogout={this.onLogout} />
                <main>
                    <Switch>
                        <Route path="/user/:userId" component={UserDetails} />
                        <Route path="/bug/:bugId" component={BugDetails} />
                        <Route path="/admin/usertable" component={UserTable} />

                        {user && <Route exact path="/" component={BugApp} />}

                        {!user && <Route exact path="/" component={() => <LoginPage
                            login={this.login}
                            signup={this.signup} />} />}
                    </Switch>
                </main>
            </Router >
        )
    }
}

