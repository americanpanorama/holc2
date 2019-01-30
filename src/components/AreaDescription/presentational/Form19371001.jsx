import React from 'react';
import PropTypes from 'prop-types';
import SimpleCategory from './SimpleCategory';
import SimpleSubcategory from './SimpleSubcategory';
import EmptyField from './EmptyField';

const Form19371001 = ({ adData }) => (
  <ul>
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
    <li>
      <span className="catNum">
        2
      </span>
      <span className="catName">
        Inhabitants
      </span>
      <ul>
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
        <li>
          <span className="catLetter">
            c
          </span>
          <span className="catName">
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
          <span className="catLetter">
            d
          </span>
          <span className="catName">
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
          data={adData[2].e}
          num={2}
          letter="e"
          name="Infiltration of"
        />
        <SimpleSubcategory
          data={adData[2].f}
          num={2}
          letter="f"
          name="Relief families"
        />
        <li>
          <span className="catLetter">
            g
          </span>
          <span className="catName">
            Population is increasing
          </span>
          <span className="subcatData">
            {(adData[2].g[1]) ? adData[2].g[1] : <EmptyField />}
          </span>
          <span className="catName">
            ; decreasing
          </span>
          <span className="subcatData">
            {(adData[2].g[2]) ? adData[2].g[2] : <EmptyField />}
          </span>
          <span className="catName">
            ; static
          </span>
          <span className="subcatData">
            {(adData[2].g[3]) ? adData[2].g[3] : <EmptyField />}
          </span>
        </li>
      </ul>
    </li>
    <li>
      <span className="catNum">
        3
      </span>
      <span className="catName">
        Buildings
      </span>
      <table>
        <thead>
          <tr>
            <th />
            <th>
              {`Predominating ${(adData[3][1]) ? adData[3][1] : <EmptyField />}%`}
            </th>
            <th>
              {`Other Type ${(adData[3][2]) ? adData[3][2] : <EmptyField />}%`}
            </th>
            <th>
              {`Other Type ${(adData[3][3]) ? adData[3][3] : <EmptyField />}%`}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <span className="catLetter">
                a
              </span>
              <span className="catName">
                Type
              </span>
            </td>
            <td>
              {(adData[3].a[1]) ? adData[3].a[1] : <EmptyField />}
            </td>
            <td>
              {(adData[3].a[2]) ? adData[3].a[2] : <EmptyField />}
            </td>
            <td>
              {(adData[3].a[3]) ? adData[3].a[3] : <EmptyField />}
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
            <td>
              {(adData[3].b[1]) ? adData[3].b[1] : <EmptyField />}
            </td>
            <td>
              {(adData[3].b[2]) ? adData[3].b[2] : <EmptyField />}
            </td>
            <td>
              {(adData[3].b[3]) ? adData[3].b[3] : <EmptyField />}
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                c
              </span>
              <span className="catName">
                Average age
              </span>
            </td>
            <td>
              {(adData[3].c[1]) ? adData[3].c[1] : <EmptyField />}
              <span className="catName">
                Years
              </span>
            </td>
            <td>
              {(adData[3].c[2]) ? adData[3].c[2] : <EmptyField />}
              <span className="catName">
                Years
              </span>
            </td>
            <td>
              {(adData[3].c[3]) ? adData[3].c[3] : <EmptyField />}
              <span className="catName">
                Years
              </span>
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
            <td>
              {(adData[3].d[1]) ? adData[3].d[1] : <EmptyField />}
            </td>
            <td>
              {(adData[3].d[2]) ? adData[3].d[2] : <EmptyField />}
            </td>
            <td>
              {(adData[3].d[3]) ? adData[3].d[3] : <EmptyField />}
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
            <td>
              {(adData[3].e[1]) ? adData[3].e[1] : <EmptyField />}
              <span className="catName">
                %
              </span>
            </td>
            <td>
              {(adData[3].e[2]) ? adData[3].e[2] : <EmptyField />}
              <span className="catName">
                %
              </span>
            </td>
            <td>
              {(adData[3].e[3]) ? adData[3].e[3] : <EmptyField />}
              <span className="catName">
                %
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                f
              </span>
              <span className="catName">
                Home Ownership
              </span>
            </td>
            <td>
              {(adData[3].f[1]) ? adData[3].f[1] : <EmptyField />}
              <span className="catName">
                %
              </span>
            </td>
            <td>
              {(adData[3].f[2]) ? adData[3].f[2] : <EmptyField />}
              <span className="catName">
                %
              </span>
            </td>
            <td>
              {(adData[3].f[3]) ? adData[3].f[3] : <EmptyField />}
              <span className="catName">
                %
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                g
              </span>
              <span className="catName">
                Constructed past yr.
              </span>
            </td>
            <td>
              {(adData[3].g[1]) ? adData[3].g[1] : <EmptyField />}
            </td>
            <td>
              {(adData[3].g[2]) ? adData[3].g[2] : <EmptyField />}
            </td>
            <td>
              {(adData[3].g[3]) ? adData[3].g[3] : <EmptyField />}
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                h
              </span>
              <span className="catName">
                1929 Price range
              </span>
            </td>
            <td>
              <span className="catName">
                $
              </span>
              {(adData[3].h[1]) ? adData[3].h[1] : <EmptyField />}
              <span className="catName">
                100%
              </span>
            </td>
            <td>
              <span className="catName">
                $
              </span>
              {(adData[3].h[2]) ? adData[3].h[2] : <EmptyField />}
              <span className="catName">
                100%
              </span>
            </td>
            <td>
              <span className="catName">
                $
              </span>
              {(adData[3].h[3]) ? adData[3].h[3] : <EmptyField />}
              <span className="catName">
                100%
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                i
              </span>
              <span className="catName">
                {`${(adData[3].i[1]) ? adData[3].i[1] : <EmptyField />} Price range`}
              </span>
            </td>
            <td>
              <span className="catName">
                $
              </span>
              {(adData[3].i[2]) ? adData[3].i[2] : <EmptyField />}
              {' '}
              {(adData[3].i[3]) ? adData[3].i[3] : <EmptyField />}
              <span className="catName">
                100%
              </span>
            </td>
            <td>
              <span className="catName">
                $
              </span>
              {(adData[3].i[4]) ? adData[3].i[4] : <EmptyField />}
              {' '}
              {(adData[3].i[5]) ? adData[3].i[5] : <EmptyField />}
              <span className="catName">
                %
              </span>
            </td>
            <td>
              <span className="catName">
                $
              </span>
              {(adData[3].i[6]) ? adData[3].i[6] : <EmptyField />}
              {' '}
              {(adData[3].i[7]) ? adData[3].i[7] : <EmptyField />}
              <span className="catName">
                %
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                j
              </span>
              <span className="catName">
                {`${(adData[3].j[1]) ? adData[3].j[1] : <EmptyField />} Price range`}
              </span>
            </td>
            <td>
              <span className="catName">
                $
              </span>
              {(adData[3].j[2]) ? adData[3].j[2] : <EmptyField />}
              {' '}
              {(adData[3].j[3]) ? adData[3].j[3] : <EmptyField />}
              <span className="catName">
                100%
              </span>
            </td>
            <td>
              <span className="catName">
                $
              </span>
              {(adData[3].j[4]) ? adData[3].j[4] : <EmptyField />}
              {' '}
              {(adData[3].j[5]) ? adData[3].j[5] : <EmptyField />}
              <span className="catName">
                %
              </span>
            </td>
            <td>
              <span className="catName">
                $
              </span>
              {(adData[3].j[6]) ? adData[3].j[6] : <EmptyField />}
              {' '}
              {(adData[3].j[7]) ? adData[3].j[7] : <EmptyField />}
              <span className="catName">
                %
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                k
              </span>
              <span className="catName">
                Sales demand Up to
              </span>
            </td>
            <td>
              {(adData[3].k[1]) ? adData[3].k[1] : <EmptyField />}
            </td>
            <td>Up to {(adData[3].k[2]) ? adData[3].k[2] : <EmptyField />}</td>
            <td>
              {(adData[3].k[3]) ? adData[3].k[3] : <EmptyField />}
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                l
              </span>
              <span className="catName">
                Activity
              </span>
            </td>
            <td>
              {(adData[3].l[1]) ? adData[3].l[1] : <EmptyField />}
            </td>
            <td>
              {(adData[3].l[2]) ? adData[3].l[2] : <EmptyField />}
            </td>
            <td>
              {(adData[3].l[3]) ? adData[3].l[3] : <EmptyField />}
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                m
              </span>
              <span className="catName">
                1929 Rent range
              </span>
            </td>
            <td>
              <span className="catName">
                $
              </span>
              {(adData[3].m[1]) ? adData[3].m[1] : <EmptyField />}
              <span className="catName">
                100%
              </span>
            </td>
            <td>
              <span className="catName">
                $
              </span>
              {(adData[3].m[2]) ? adData[3].m[2] : <EmptyField />}
              <span className="catName">
                100%
              </span>
            </td>
            <td>
              <span className="catName">
                $
              </span>
              {(adData[3].m[3]) ? adData[3].m[3] : <EmptyField />}
              <span className="catName">
                100%
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                n
              </span>
              <span className="catName">
                {`${(adData[3].n[1]) ? adData[3].n[1] : <EmptyField />} Rent range`}
              </span>
            </td>
            <td>
              <span className="catName">
                $
              </span>
              {(adData[3].n[2]) ? adData[3].n[2] : <EmptyField />}
              {' '}
              {(adData[3].n[3]) ? adData[3].n[3] : <EmptyField />}
              <span className="catName">
                100%
              </span>
            </td>
            <td>
              <span className="catName">
                $
              </span>
              {(adData[3].n[4]) ? adData[3].n[4] : <EmptyField />}
              {' '}
              {(adData[3].n[5]) ? adData[3].n[5] : <EmptyField />}
              <span className="catName">
                %
              </span>
            </td>
            <td>
              <span className="catName">
                $
              </span>
              {(adData[3].n[6]) ? adData[3].n[6] : <EmptyField />}
              {' '}
              {(adData[3].n[7]) ? adData[3].n[7] : <EmptyField />}
              <span className="catName">
                %
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                o
              </span>
              <span className="catName">
                {`${(adData[3].o[1]) ? adData[3].o[1] : <EmptyField />} Rent range`}
              </span>
            </td>
            <td>
              <span className="catName">
                $
              </span>
              {(adData[3].o[2]) ? adData[3].o[2] : <EmptyField />}
              {' '}
              {(adData[3].o[3]) ? adData[3].o[3] : <EmptyField />}
              <span className="catName">
                100%
              </span>
            </td>
            <td>
              <span className="catName">
                $
              </span>
              {(adData[3].o[4]) ? adData[3].o[4] : <EmptyField />}
              {' '}
              {(adData[3].o[5]) ? adData[3].o[5] : <EmptyField />}
              <span className="catName">
                %
              </span>
            </td>
            <td>
              <span className="catName">
                $
              </span>
              {(adData[3].o[6]) ? adData[3].o[6] : <EmptyField />}
              {' '}
              {(adData[3].o[7]) ? adData[3].o[7] : <EmptyField />}
              <span className="catName">
                %
              </span>
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                p
              </span>
              <span className="catName">
                Rental demand Up to
              </span>
            </td>
            <td>
              {(adData[3].p[1]) ? adData[3].p[1] : <EmptyField />}
            </td>
            <td>
              {`Up to ${(adData[3].p[2]) ? adData[3].p[2] : <EmptyField />}`}
            </td>
            <td>
              {(adData[3].p[3]) ? adData[3].p[3] : <EmptyField />}
            </td>
          </tr>
          <tr>
            <td>
              <span className="catLetter">
                q
              </span>
              <span className="catName">
                Activity
              </span>
            </td>
            <td>
              {(adData[3].q[1]) ? adData[3].q[1] : <EmptyField />}
            </td>
            <td>
              {(adData[3].q[2]) ? adData[3].q[2] : <EmptyField />}
            </td>
            <td>
              {(adData[3].q[3]) ? adData[3].q[3] : <EmptyField />}
            </td>
          </tr>
        </tbody>
      </table>
    </li>
    <li>
      <span className="catNum">
        4
      </span>
      <span className="catName">
        Availability of Mortgage Funds
      </span>
      <ul>
        <SimpleSubcategory
          data={adData[4].a}
          num={4}
          letter="a"
          name="Home purchase"
        />
        <SimpleSubcategory
          data={adData[4].b}
          num={4}
          letter="b"
          name="Home building"
        />
      </ul>
    </li>
    <SimpleCategory
      data={adData[5]}
      num={5}
      name="Clarifying Remarks"
    />
    <li>
      <span className="catNum">
        6
      </span>
      <span className="catName">
        Name and Location
      </span>
      <span className="subcatData">
        {(adData[6] && adData[6][1]) ? adData[6][1] : <EmptyField />}
      </span>
      <span className="catName">
        Security Grade
      </span>
      <span className="subcatData">
        {(adData[6] && adData[6][2]) ? adData[6][2] : <EmptyField />}
      </span>
      <span className="catName">
        Area No.
      </span>
      <span className="subcatData">
        {(adData[6] && adData[6][3]) ? adData[6][3] : <EmptyField />}
      </span>
    </li>
  </ul>
);

Form19371001.propTypes = {
  adData: PropTypes.object.isRequired,
};

export default Form19371001;
