export const continentCountries = {
    'Africa': [
        'Ethiopia', 'S. Sudan', 'Somalia', 'Kenya', 'Malawi', 'Tanzania',
        'Somaliland', 'Morocco', 'W. Sahara', 'Congo', 'Dem. Rep. Congo',
        'Namibia', 'South Africa', 'Libya', 'Tunisia', 'Zambia', 'Sierra Leone',
        'Guinea', 'Liberia', 'Central African Rep.', 'Sudan', 'Djibouti',
        'Eritrea', 'Côte d\'Ivoire', 'Mali', 'Senegal', 'Nigeria', 'Benin',
        'Angola', 'Botswana', 'Zimbabwe', 'Chad', 'Algeria', 'Mozambique',
        'Eswatini', 'Burundi', 'Rwanda', 'Uganda', 'Lesotho', 'Cameroon',
        'Gabon', 'Niger', 'Burkina Faso', 'Togo', 'Ghana', 'Guinea-Bissau',
        'Egypt', 'Mauritania', 'Eq. Guinea', 'Gambia', 'Bir Tawil',
        'Madagascar', 'Comoros', 'São Tomé and Principe', 'Cabo Verde'
    ],
    'Asia': [
        'Indonesia', 'Malaysia', 'Dhekelia', 'Cyprus', 'India', 'China',
        'Israel', 'Palestine', 'Lebanon', 'Syria', 'South Korea', 'North Korea',
        'Bhutan', 'Oman', 'Uzbekistan', 'Kazakhstan', 'Tajikistan', 'Mongolia',
        'Vietnam', 'Cambodia', 'United Arab Emirates', 'Georgia', 'Azerbaijan',
        'Turkey', 'Laos', 'Kyrgyzstan', 'Armenia', 'Iraq', 'Iran', 'Qatar',
        'Saudi Arabia', 'Pakistan', 'Thailand', 'Kuwait', 'Timor-Leste',
        'Brunei', 'Myanmar', 'Bangladesh', 'Afghanistan', 'Turkmenistan',
        'Jordan', 'Nepal', 'Yemen', 'Hong Kong', 'N. Cyprus',
        'Cyprus U.N. Buffer Zone', 'Siachen Glacier', 'Baikonur', 'Akrotiri',
        'Philippines', 'Sri Lanka', 'Taiwan', 'Japan', 'Indian Ocean Ter.',
        'Singapore', 'Bahrain', 'Spratly Is.', 'Macao', 'Scarborough Reef'
    ],
    'Europe': [
        'France', 'Ukraine', 'Belarus', 'Lithuania', 'Russia', 'Czechia',
        'Germany', 'Estonia', 'Latvia', 'Norway', 'Sweden', 'Finland',
        'Luxembourg', 'Belgium', 'North Macedonia', 'Albania', 'Kosovo',
        'Spain', 'Denmark', 'Romania', 'Hungary', 'Slovakia', 'Poland',
        'Ireland', 'United Kingdom', 'Greece', 'Austria', 'Italy',
        'Switzerland', 'Netherlands', 'Liechtenstein', 'Serbia', 'Croatia',
        'Slovenia', 'Bulgaria', 'San Marino', 'Monaco', 'Andorra',
        'Montenegro', 'Bosnia and Herz.', 'Portugal', 'Moldova', 'Gibraltar',
        'Vatican', 'Iceland', 'Malta', 'Jersey', 'Guernsey', 'Isle of Man',
        'Åland', 'Faeroe Is.'
    ],
    'North America': [
        'Costa Rica', 'Nicaragua', 'St-Martin', 'Sint Maarten', 'Haiti',
        'Dominican Rep.', 'El Salvador', 'Guatemala', 'USNB Guantanamo Bay',
        'Cuba', 'Honduras', 'United States of America', 'Canada', 'Mexico',
        'Belize', 'Panama', 'Greenland', 'Curaçao', 'Aruba', 'Bahamas',
        'Turks and Caicos Is.', 'St. Pierre and Miquelon', 'Trinidad and Tobago',
        'Grenada', 'St. Vin. and Gren.', 'Barbados', 'Saint Lucia', 'Dominica',
        'U.S. Minor Outlying Is.', 'Montserrat', 'Antigua and Barb.',
        'St. Kitts and Nevis', 'U.S. Virgin Is.', 'St-Barthélemy', 'Puerto Rico',
        'Anguilla', 'British Virgin Is.', 'Jamaica', 'Cayman Is.', 'Bermuda',
        'Bajo Nuevo Bank', 'Serranilla Bank'
    ],
    'South America': [
        'Chile', 'Bolivia', 'Peru', 'Argentina', 'Suriname', 'Guyana',
        'Brazil', 'Uruguay', 'Ecuador', 'Colombia', 'Paraguay',
        'Brazilian I.', 'Venezuela', 'Southern Patagonian Ice Field',
        'Falkland Is.'
    ],
    'Oceania': [
        'Papua New Guinea', 'Australia', 'Fiji', 'New Zealand',
        'New Caledonia', 'Pitcairn Is.', 'Fr. Polynesia', 'Kiribati',
        'Marshall Is.', 'Norfolk Island', 'Cook Is.', 'Tonga',
        'Wallis and Futuna Is.', 'Samoa', 'Solomon Is.', 'Tuvalu', 'Nauru',
        'Micronesia', 'Vanuatu', 'Niue', 'American Samoa', 'Palau', 'Guam',
        'N. Mariana Is.', 'Coral Sea Is.', 'Ashmore and Cartier Is.'
    ],
    'Seven seas (open ocean)': [
        'Fr. S. Antarctic Lands', 'Seychelles', 'Heard I. and McDonald Is.',
        'Saint Helena', 'Mauritius', 'Br. Indian Ocean Ter.', 'Maldives',
        'S. Geo. and the Is.', 'Clipperton I.'
    ],
    'Antarctica': [
        '-'
    ]
};

export function getContinentByCountry(country: string): string | null {
  const localCountry = country;
  for (const continent in continentCountries) {
    if (
      continentCountries[continent as keyof typeof continentCountries].includes(
        country
      )
    ) {
      return continent;
    }
  }
  return null;
}