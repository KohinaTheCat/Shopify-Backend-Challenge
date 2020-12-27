import React from "react";
import { Button } from "element-react";
import { useHistory } from 'react-router-dom';
import "./home.css";

function Home(props) {
const history = useHistory();
  return (
    <div class="background">
      <div class="circle" />
      <h1 id="title1">Remémorer</h1>
      <h1 id="title2">Remémorer</h1>
      <h3>
        to reminisce, in french.
        <div v-if="width">to indulge in enjoyable recollection of past events.</div>
      </h3>
      <Button onClick={() => history.push("/profile")} type="danger">reminisce now
      </Button>
    </div>
  );
}

export default Home;
