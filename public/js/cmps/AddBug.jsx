export class AddBug extends React.Component {
    state = {
        name: '',
        description: '',
        severity: 1,
    }

    handleChange = (ev) => {
        const field = ev.target.name;
        const value = ev.target.value;
        this.setState({ ...this.state, [field]: value });
    };

    onAddBug = (ev = null) => {
        if (!this.state.name || !this.state.description || !this.state.severity) return;
        if (ev) ev.preventDefault();
        this.props.addBug(this.state);
        this.clearState()
    };

    clearState = () => {
        const clearTemplate = {
            name: '',
            description: '',
            severity: 1,
        }
        this.setState({ ...clearTemplate })
    }


    render() {
        const { name: name, description, severity } = this.state;
        return (
            <form className="add-bug" onSubmit={this.onAddBug}>
                <label htmlFor="bug-name">Name:</label>
                <input autoComplete="off" type="text" name="name" id="bug-name" value={name} onChange={this.handleChange} required />

                <label htmlFor="bug-description">Description:</label>
                <input autoComplete="off" type="text" name="description" id="bug-description" value={description} onChange={this.handleChange} required />

                <label htmlFor="bug-severity">Importance:</label>
                <input autoComplete="off" type="number" name="severity" id="bug-severity" min="1" max="3" value={severity} onChange={this.handleChange} />

                <button>Enter!</button>
            </form>
        )
    }

}