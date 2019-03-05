import React from 'react';
import PropTypes from 'prop-types';
import SimpleCategory from '../../containers/SimpleCategory';
import SimpleSubcategory from '../../containers/SimpleSubcategory';
import EmptyField from '../../presentational/EmptyField';

const Form1939 = ({ adData, selectCategory }) => (
  <ul>
    <li>
      <span className="catNum">
        1
      </span>
      <span className="catName">
        Population
      </span>
      <ul>
        <li>
          <span
            className="catLetter catSelectable"
            onClick={selectCategory}
            id="1-a"
          >
            a
          </span>
          <span className="catName">
            Increasing
          </span>
          <span className="subcatData">
            {(adData[1] && adData[1].a[1]) ? adData[1].a[1] : <EmptyField />}
          </span>
          <span className="catName">
            &nbsp;&nbsp;Decreasing
          </span>
          <span className="subcatData">
            {(adData[1] && adData[1].a[2]) ? adData[1].a[2] : <EmptyField />}
          </span>
          <span className="catName">
            &nbsp;&nbsp;Static
          </span>
          <span className="subcatData">
            {(adData[1] && adData[1].a[3]) ? adData[1].a[3] : <EmptyField />}
          </span>
        </li>
        <SimpleSubcategory
          data={adData[1].b}
          num={1}
          letter="b"
          name="Class and Occupation"
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
          after="%"
        />
        <SimpleSubcategory
          data={adData[1].e}
          num={1}
          letter="e"
          name="Shifting or Infiltration"
        />
      </ul>
    </li>
    <li>
      <span className="catNum">
        2
      </span>
      <span className="catName">
        Buildings
      </span>
      <table>
        <tbody>
          <tr>
            <th />
            <th colSpan={2}>
              {'Predominating '}
              {(adData[2] && adData[2][1]) ? adData[2][1] : <EmptyField />}
              %
            </th>
            <th colSpan={2}>
              {'Other Type '}
              {(adData[2] && adData[2][2]) ? adData[2][2] : <EmptyField />}
              %
            </th>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                a
              </span>
              <span className="catName">
                Type and Size
              </span>
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].a[1]) ? adData[2].a[1] : <EmptyField />}
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].a[2]) ? adData[2].a[2] : <EmptyField />}
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                b
              </span>
              <span className="catName">
                Construction
              </span>
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].b[1]) ? adData[2].b[1] : <EmptyField />}
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].b[2]) ? adData[2].b[2] : <EmptyField />}
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                c
              </span>
              <span className="catName">
                Average Age
              </span>
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].c[1]) ? adData[2].c[1] : <EmptyField />}
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].c[2]) ? adData[2].c[2] : <EmptyField />}
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                d
              </span>
              <span className="catName">
                Repair
              </span>
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].d[1]) ? adData[2].d[1] : <EmptyField />}
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].d[1]) ? adData[2].d[1] : <EmptyField />}
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                e
              </span>
              <span className="catName">
                Occupancy
              </span>
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].e[1]) ? adData[2].e[1] : <EmptyField />}
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].e[2]) ? adData[2].e[2] : <EmptyField />}
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                f
              </span>
              <span className="catName">
                Owner-occupied
              </span>
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].f[1]) ? adData[2].f[1] : <EmptyField />}
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].f[2]) ? adData[2].f[2] : <EmptyField />}
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                g
              </span>
              <span className="catName">
                1935 Price Bracket
              </span>
            </td>
            <td>
              $
              {(adData[2] && adData[2].g[1]) ? adData[2].g[1] : <EmptyField />}
            </td>
            <th>
              % change
            </th>
            <td>
              $
              {(adData[2] && adData[2].g[2]) ? adData[2].g[2] : <EmptyField />}
            </td>
            <th>
              % change
            </th>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                h
              </span>
              <span className="catName">
                1937 Price Bracket
              </span>
            </td>
            <td>
              $
              {(adData[2] && adData[2].h[1]) ? adData[2].h[1] : <EmptyField />}
            </td>
            <td>
              {(adData[2] && adData[2].h[2]) ? adData[2].h[2] : <EmptyField />}
              %
            </td>
            <td>
              $
              {(adData[2] && adData[2].h[3]) ? adData[2].h[3] : <EmptyField />}
            </td>
            <td>
              {(adData[2] && adData[2].h[4]) ? adData[2].h[4] : <EmptyField />}
              %
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                i
              </span>
              {(adData[2] && adData[2].i[1]) ? adData[2].i[1] : <EmptyField />}
              <span className="catName">
                Price Bracket
              </span>
            </td>
            <td>
              $
              {(adData[2] && adData[2].i[2]) ? adData[2].i[2] : <EmptyField />}
            </td>
            <td>
              {(adData[2] && adData[2].i[3]) ? adData[2].i[3] : <EmptyField />}
              %
            </td>
            <td>
              $
              {(adData[2] && adData[2].i[4]) ? adData[2].i[4] : <EmptyField />}
            </td>
            <td>
              {(adData[2] && adData[2].i[5]) ? adData[2].i[5] : <EmptyField />}
              %
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                j
              </span>
              <span className="catName">
                Sales Demand
              </span>
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].j[1]) ? adData[2].j[1] : <EmptyField />}
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].j[2]) ? adData[2].j[2] : <EmptyField />}
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                k
              </span>
              <span className="catName">
                Predicted Price Trend
                <br />
                (next 6-12 months)
              </span>
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].k[1]) ? adData[2].k[1] : <EmptyField />}
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].k[2]) ? adData[2].k[2] : <EmptyField />}
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                l
              </span>
              <span className="catName">
                1935 Rent Bracket
              </span>
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].l[1]) ? adData[2].l[1] : <EmptyField />}
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].l[2]) ? adData[2].l[2] : <EmptyField />}
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                m
              </span>
              <span className="catName">
                1937 Rent Bracket
              </span>
            </td>
            <td>
              $
              {(adData[2] && adData[2].m[1]) ? adData[2].m[1] : <EmptyField />}
            </td>
            <td>
              {(adData[2] && adData[2].m[2]) ? adData[2].m[2] : <EmptyField />}
              %
            </td>
            <td>
              $
              {(adData[2] && adData[2].m[3]) ? adData[2].m[3] : <EmptyField />}
            </td>
            <td>
              {(adData[2] && adData[2].m[4]) ? adData[2].m[4] : <EmptyField />}
              %
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                n
              </span>
              {(adData[2] && adData[2].n[1]) ? adData[2].n[1] : <EmptyField />}
              <span className="catName">
                Rent Bracket
              </span>
            </td>
            <td>
              $
              {(adData[2] && adData[2].n[2]) ? adData[2].n[2] : <EmptyField />}
            </td>
            <td>
              {(adData[2] && adData[2].n[3]) ? adData[2].n[3] : <EmptyField />}
              %
            </td>
            <td>
              $
              {(adData[2] && adData[2].n[4]) ? adData[2].n[4] : <EmptyField />}
            </td>
            <td>
              {(adData[2] && adData[2].n[5]) ? adData[2].n[5] : <EmptyField />}
              %
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                o
              </span>
              <span className="catName">
                Rental Demand
              </span>
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].o[1]) ? adData[2].o[1] : <EmptyField />}
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].o[2]) ? adData[2].o[2] : <EmptyField />}
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                p
              </span>
              <span className="catName">
                Predicted Rent Trend
                <br />
                (next 6-12 months)
              </span>
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].p[1]) ? adData[2].p[1] : <EmptyField />}
            </td>
            <td colSpan={2}>
              {(adData[2] && adData[2].p[2]) ? adData[2].p[2] : <EmptyField />}
            </td>
          </tr>
        </tbody>
      </table>
    </li>
    <li>
      <span className="catNum">
        3
      </span>
      <span className="catName">
        New Construction (past yr.)
      </span>
      <div>
        <span className="subcatName">
          No.
        </span>
        {(adData[3] && adData[3][1]) ? adData[3][1] : <EmptyField />}
        <span className="subcatName">
          Type &amp; Price
        </span>
        {(adData[3] && adData[3][2]) ? adData[3][2] : <EmptyField />}
        <span className="subcatName">
          How Selling
        </span>
        {(adData[3] && adData[3][3]) ? adData[3][3] : <EmptyField />}
      </div>
    </li>
    <li>
      <span className="catNum">
        4
      </span>
      <span className="catName">
        Overhang of Home Properties
      </span>
      <ul>
        <SimpleSubcategory
          data={adData[4].a}
          num={4}
          letter="a"
          name="HOLC"
        />
        <SimpleSubcategory
          data={adData[4].b}
          num={4}
          letter="b"
          name="Institutions"
        />
      </ul>
    </li>
    <li>
      <span className="catNum">
        5
      </span>
      <span className="catName">
        Sale of Home Properties
      </span>
      <ul>
        <SimpleSubcategory
          data={adData[5].a}
          num={5}
          letter="a"
          name="HOLC"
        />
        <SimpleSubcategory
          data={adData[5].b}
          num={5}
          letter="b"
          name="Institutions"
        />
      </ul>
    </li>
    <SimpleCategory
      data={adData[6]}
      num={6}
      name="Mortgage Funds"
    />
    <li>
      <span className="catNum">
        7
      </span>
      <span className="catName">
        Total Tax Rate Per $1000 (193
      </span>
      {(adData[7] && adData[7][1]) ? adData[7][1] : <EmptyField />}
      <span className="catName">
          )
      </span>
      <span className="catData">
        {(adData[7] && adData[7][2]) ? adData[7][2] : <EmptyField />}
      </span>
    </li>
    <SimpleCategory
      data={adData[8]}
      num={8}
      name="Description and Characteristics of Area"
    />
    <li>
      <span className="catNum">
        9
      </span>
      <span className="catName">
        Location
      </span>
      {(adData[9][1]) ? adData[9][1] : <EmptyField />}
      <div>
        <span className="catName">
          Security Grade
        </span>
        {(adData[9] && adData[9][2]) ? adData[9][2] : <EmptyField />}
      </div>
      <div>
        <span className="catName">
          Area No
        </span>
        {(adData[9] && adData[9][3]) ? adData[9][3] : <EmptyField />}
      </div>
      <div>
        <span className="catName">
          Date
        </span>
        {(adData[9] && adData[9][4]) ? adData[9][4] : <EmptyField />}
      </div>
    </li>
  </ul>
);

export default Form1939;

Form1939.propTypes = {
  adData: PropTypes.object.isRequired,
  selectCategory: PropTypes.func.isRequired,
};
