import React from 'react';
import PropTypes from 'prop-types';
import SimpleCategory from '../../containers/SimpleCategory';
import SimpleSubcategory from '../../containers/SimpleSubcategory';
import EmptyField from '../../presentational/EmptyField';

const Form1939Curated = ({ adData, selectCategory }) => (
  <ul>
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
          <span
            className="catLetter catSelectable"
            onClick={selectCategory}
            id="1-c"
          >
            c
          </span>
          <span
            className="catName catSelectable"
            onClick={selectCategory}
            id="1-c"
          >
            Foreign Families
          </span>
          <span className="subcatData">
            {(adData[1] && adData[1].c[1]) ? adData[1].c[1] : <EmptyField />}
          </span>
          <span className="catName">
            % Nationalities&nbsp;
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
  selectCategory: PropTypes.func.isRequired,
};
