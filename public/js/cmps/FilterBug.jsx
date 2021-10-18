export class FilterBug extends React.Component {
  state = {
    filter: '',
    page: 0,
  };

  handleChange = (ev) => {
    const filter = ev.target.value;
    this.setState({ filter }, () => {
      this.props.filterBugs(filter);
    });
  };

  handlePage = (ev) => {
    const page = +ev.target.value;
    if (page < 0) return;
    this.setState({ page }, () => {
      this.props.filterBugs(page);
    });
  };

  render() {
    const { filter, page } = this.state;
    return (
      <section className="filter-bug">
        <button onClick={this.handlePage} value={page - 1}>
          Back
        </button>
        <select value={filter} onChange={this.handleChange} placeholder="All">
          <option value="">All</option>
          <option value="name">Name</option>
          <option value="severity">Severity</option>
          <option value="created_at">By date</option>
        </select>
        <button onClick={this.handlePage} value={page + 1}>
          Next
        </button>
      </section>
    );
  }
}
