import { bugService } from './../services/bug.service.js';
import { userService } from './../services/user.service.js';

import { BugTable } from '../cmps/BugTable.jsx';
import { AddBug } from '../cmps/AddBug.jsx';
import { FilterBug } from './../cmps/FilterBug.jsx';

export class BugApp extends React.Component {
  state = {
    bugs: [],
    bugFilter: {
      filter: '',
      page: 0,
    },
  };

  async componentDidMount() {
    const user = userService.getLoggedinUser();
    if (!user) {
      this.props.history.push('/');
      return;
    }
    const bugs = await bugService.query(this.state.bugFilter)
    this.setState({ bugs });
  }

  onRemoveBug = async (bugId) => {
    await bugService.remove(bugId)
    console.log('Deleted Succesfully!');
    let { bugs } = this.state;
    bugs = bugs.filter((bug) => bug._id !== bugId);
    this.setState({ bugs });
  };

  addBug = async (bug) => {
    const savedBug = await bugService.add(bug)
    console.log('Added Bug', savedBug);
    this.setState({ bugs: [savedBug, ...this.state.bugs] });
  };

  filterBugs = async (filter) => {
    // PAGE
    if (typeof filter === 'number') {
      this.setState(
        { bugFilter: { ...this.state.bugFilter, page: filter } },
        async () => {
          const bugs = await bugService.query(this.state.bugFilter)
          this.setState({ bugs });
        }
      );
      // FILTER
    } else {
      this.setState(
        { bugFilter: { ...this.state.bugFilter, filter, page: 0 } },
        async () => {
          const bugs = await bugService.query(this.state.bugFilter)
          this.setState({ bugs });
        }
      );
    }
  };

  render() {
    const { bugs } = this.state;
    return (
      <div className="bug-app">
        <FilterBug filterBugs={this.filterBugs} />
        {bugs.length > 0 ? (
          <BugTable bugs={bugs} onRemoveBug={this.onRemoveBug} />
        ) : (
          <h2>No bugs bzzt!</h2>
        )}
        <AddBug addBug={this.addBug} />
      </div>
    );
  }
}
