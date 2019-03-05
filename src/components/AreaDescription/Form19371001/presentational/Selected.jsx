import React from 'react';
import PropTypes from 'prop-types';
import SimpleCategory from '../../containers/SimpleCategory';
import SimpleSubcategory from '../../containers/SimpleSubcategory';
import EmptyField from '../../presentational/EmptyField';

const Form19371001Curated = ({ adData, selectCategory }) => (
  <div className="areaDescription">
    <ul className="area_description NSForm8">
      <SimpleCategory
        data={adData[5]}
        num={5}
        name="Clarifying Remarks"
      />
      <li>
        <span className="catNum">
          2
        </span>
        <span className="catName">
          Inhabitants
        </span>
        <ul>
          <SimpleSubcategory
            data={adData[2].e}
            num={2}
            letter="e"
            name="Infiltration of"
          />
          <li>
            <span
              className="catLetter catSelectable"
              onClick={selectCategory}
              id="2-c"
            >
              c
            </span>
            <span
              className="catName catSelectable"
              onClick={selectCategory}
              id="2-c"
            >
              Foreign-born families
            </span>
            <span className="subcatData">
              {(adData[2].c[1]) ? adData[2].c[1] : <EmptyField />}
            </span>
            <span className="catName">
              %;
            </span>
            <span className="subcatData">
              {(adData[2].c[2]) ? adData[2].c[2] : <EmptyField />}
            </span>
            <span className="catName">
              predominating
            </span>
          </li>
          <li>
            <span
              className="catLetter catSelectable"
              onClick={selectCategory}
              id="2-d"
            >
              d
            </span>
            <span
              className="catName catSelectable"
              onClick={selectCategory}
              id="2-d"
            >
              Negro
            </span>
            <span className="subcatData">
              {(adData[2].d[1]) ? adData[2].d[1] : <EmptyField />}
            </span>
            <span className="catName">
              %;
            </span>
            <span className="subcatData">
              {(adData[2].d[2]) ? adData[2].d[2] : <EmptyField />}
            </span>
            <span className="catName">
              predominating
            </span>
          </li>
          <SimpleSubcategory
            data={adData[2].f}
            num={2}
            letter="f"
            name="Relief families"
          />
          <SimpleSubcategory
            data={adData[2].a}
            num={2}
            letter="a"
            name="Occupation"
          />
          <SimpleSubcategory
            data={adData[2].b}
            num={2}
            letter="b"
            name="Estimated Annual Family Income"
          />
        </ul>
      </li>
      <li>
        <span className="catNum">
          1
        </span>
        <span className="catName">
          Area Characteristics
        </span>
        <ul>
          <SimpleSubcategory
            data={adData[1].a}
            num={1}
            letter="a"
            name="Description of Terrain"
          />
          <SimpleSubcategory
            data={adData[1].b}
            num={1}
            letter="b"
            name="Favorable Influences"
          />
          <SimpleSubcategory
            data={adData[1].c}
            num={1}
            letter="c"
            name="Detrimental Influences"
          />
          <SimpleSubcategory
            data={adData[1].d}
            num={1}
            letter="d"
            name="Percentage of land improved"
          />
          <SimpleSubcategory
            data={adData[1].e}
            num={1}
            letter="e"
            name="Trend of desireability next 10-15 yrs."
          />
        </ul>
      </li>
    </ul>
  </div>
);

Form19371001Curated.propTypes = {
  adData: PropTypes.object.isRequired,
  selectCategory: PropTypes.func.isRequired,
};

export default Form19371001Curated;
