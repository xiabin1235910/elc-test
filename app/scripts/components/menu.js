/**
 * This file will hold the Menu that lives at the top of the Page, this is all rendered using a React Component...
 * 
 */
import React from 'react';

const debounce = (cb, time) => {
    let timer = null;

    return (...arg) => {
        timer && clearTimeout(timer);
        timer = setTimeout(() => {
            cb(...arg);
        }, time);
    }
}

const search = (input, cb) => {
    fetch(`http://localhost:3035/search?keyword=${input}`).then((res) => res.json()).then((jsonData) => {
        cb(jsonData.result)
    })
}

const searchWrapper = debounce(search, 500);

class Menu extends React.Component {

    /**
     * Main constructor for the Menu Class
     * @memberof Menu
     */
    constructor() {
        super();
        this.state = {
            showingSearch: false,
            showingResult: null
        };
    }

    /**
     * Shows or hides the search container
     * @memberof Menu
     * @param e [Object] - the event from a click handler
     */
    showSearchContainer(e) {
        e.preventDefault();
        this.setState({
            showingSearch: !this.state.showingSearch
        });
    }

    /**
     * Calls upon search change
     * @memberof Menu
     * @param e [Object] - the event from a text change handler
     */
    onSearch(e) {

        // Start Here
        // ...
        const input = e.target.value;

        searchWrapper(input, (data) => {
            this.setState({
                showingResult: data
            })
        })
    }

    /**
     * Renders the default app in the window, we have assigned this to an element called root.
     * 
     * @returns JSX
     * @memberof App
    */
    render() {
        return (
            <header className="menu">
                <div className="menu-container">
                    <div className="menu-holder">
                        <h1>ELC</h1>
                        <nav>
                            <a href="#" className="nav-item">HOLIDAY</a>
                            <a href="#" className="nav-item">WHAT'S NEW</a>
                            <a href="#" className="nav-item">PRODUCTS</a>
                            <a href="#" className="nav-item">BESTSELLERS</a>
                            <a href="#" className="nav-item">GOODBYES</a>
                            <a href="#" className="nav-item">STORES</a>
                            <a href="#" className="nav-item">INSPIRATION</a>

                            <a href="#" onClick={(e) => this.showSearchContainer(e)}>
                                <i className="material-icons search">search</i>
                            </a>
                        </nav>
                    </div>
                </div>
                <div className={(this.state.showingSearch ? "showing " : "") + "search-container"}>
                    <input type="text" onChange={(e) => this.onSearch(e)} />
                    <a href="#" onClick={(e) => this.showSearchContainer(e)}>
                        <i className="material-icons close">close</i>
                    </a>
                    <div className="result-container">
                        {
                            this.state.showingResult && (this.state.showingResult.length === 0 ? <div>No Result...</div> :
                                this.state.showingResult.map((res) => {
                                    return (
                                        <div key={res._id}>
                                            <div className='image'>
                                                <img src={`http://localhost:3035${res.picture}`} />
                                            </div>
                                            <div className="price">
                                                {res.price}
                                            </div>
                                            <div className="name">
                                                {res.name}
                                            </div>
                                            <div className="about">
                                                {res.about}
                                            </div>
                                        </div>
                                    )
                                })
                            )

                        }
                    </div>
                </div>
            </header>
        );
    }


}

// Export out the React Component
module.exports = Menu;