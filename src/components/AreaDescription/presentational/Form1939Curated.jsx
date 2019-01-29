import React from 'react';
import PropTypes from 'prop-types';
import SimpleCategory from './SimpleCategory';
import SimpleSubcategory from './SimpleSubcategory';
import EmptyField from './EmptyField';

const Form1939Curated = ({ adData }) => (
  <ul className="area_description">
    <SimpleCategory
      data={adData[8]}
      num={8}
      name="Description and Characteristics of Area"
    />
    <li>
      <span className="catNum">
        1
      </span>
      <span className="catName">
        Population
      </span>
      <ul>
        <SimpleSubcategory
          data={adData[1].e}
          num={1}
          letter="e"
          name="Shifting or Infiltration"
        />
        <li>
          <span className="catLetter">
            c
          </span>
          <span className="catName">
            Foreign Families
          </span>
          <span className="subcatData">
            {(adData[1] && adData[1].c[1]) ? adData[1].c[1] : <EmptyField />}
          </span>
          <br />
          <span className="catName">
           Nationalities
          </span>
          <span className="subcatData">
            {(adData[1] && adData[1].c[2]) ? adData[1].c[2] : <EmptyField />}
          </span>
        </li>
        <SimpleSubcategory
          data={adData[1].d}
          num={1}
          letter="d"
          name="Negro"
        />
        <SimpleSubcategory
          data={adData[1].b}
          num={1}
          letter="b"
          name="Class and Occupation"
        />
      </ul>
    </li>
  </ul>
);

export default Form1939Curated;

Form1939Curated.propTypes = {
  adData: PropTypes.object.isRequired,
};
