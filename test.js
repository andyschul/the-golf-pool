const redis = require('redis')
const client = redis.createClient(process.env.REDIS_URL);
const {promisify} = require('util');
const getAsync = promisify(client.get).bind(client);

let response = {
    "id": "b404a8d5-5e33-4417-ae20-5d4d147042ee",
    "name": "Masters Tournament",
    "event_type": "stroke",
    "purse": 11000000.0,
    "winning_share": 1980000.0,
    "currency": "USD",
    "points": 600,
    "start_date": "2018-04-05",
    "end_date": "2018-04-08",
    "course_timezone": "US/Eastern",
    "seasons": [{
        "id": "dbc9bbb1-e51c-47bc-8f72-be7598ffbf7e",
        "year": 2018,
        "tour": {
            "id": "b52068af-28e4-4e91-bdbb-037591b0ff84",
            "alias": "pga",
            "name": "PGA Tour"
        }
    }, {
        "id": "8cf42dd8-8a1e-4a8a-9137-dc6ac59cd63d",
        "year": 2018,
        "tour": {
            "id": "e97bb87a-6347-40d0-8c8c-3d0f54a41043",
            "alias": "EURO",
            "name": "European Tour"
        }
    }],
    "coverage": "full",
    "status": "closed",
    "round": {
        "id": "ab50dbfa-a5c7-48d6-8166-a7971934e342",
        "number": 1,
        "status": "closed",
        "courses": [{
            "id": "7e9462a5-66ea-4205-b37a-81884e3653cf",
            "name": "Augusta National",
            "yardage": 7435,
            "par": 72,
            "pairings": [{
                "tee_time": "2018-04-05T12:30:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "03bdd912-c363-4517-99b5-7a1ec757ebe5",
                    "first_name": "Ted",
                    "last_name": "Potter",
                    "country": "UNITED STATES"
                }, {
                    "id": "be6ec8b4-536a-4134-917d-9336b32cfdd8",
                    "first_name": "Wesley",
                    "last_name": "Bryan",
                    "country": "UNITED STATES"
                }, {
                    "id": "1f189584-ff86-42da-9743-40397cb9d5ff",
                    "first_name": "Austin",
                    "last_name": "Cook",
                    "country": "UNITED STATES"
                }]
            }, {
                "tee_time": "2018-04-05T12:41:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "94c4646a-c6f7-4bc8-9543-ac7e93814cd7",
                    "first_name": "Ryan",
                    "last_name": "Moore",
                    "country": "UNITED STATES"
                }, {
                    "id": "f7f29a09-7e04-4d72-9e83-137f502b056f",
                    "first_name": "Ian",
                    "last_name": "Woosnam",
                    "country": "WALES"
                }, {
                    "id": "4c25a86b-b1ff-46b4-bc95-ac61dda7bb55",
                    "first_name": "Jhonattan",
                    "last_name": "Vegas",
                    "country": "VENEZUELA"
                }]
            }, {
                "tee_time": "2018-04-05T12:52:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "40e7e8a5-ca63-48fc-a2c3-5fdc53f57e67",
                    "first_name": "Matt",
                    "last_name": "Parziale",
                    "country": "UNITED STATES"
                }, {
                    "id": "b8003ab4-6c80-41a5-9f54-901d5269434b",
                    "first_name": "Mike",
                    "last_name": "Weir",
                    "country": "CANADA"
                }, {
                    "id": "5003f675-818b-410a-9f2e-1a860d152900",
                    "first_name": "Brendan",
                    "last_name": "Steele",
                    "country": "UNITED STATES"
                }]
            }, {
                "tee_time": "2018-04-05T13:03:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "b204a677-d3e0-40fb-88de-332798bc2379",
                    "first_name": "Kevin",
                    "last_name": "Chappell",
                    "country": "UNITED STATES"
                }, {
                    "id": "1c228994-a417-4452-896c-e77cdbe9af6b",
                    "first_name": "Dylan",
                    "last_name": "Frittelli",
                    "country": "SOUTH AFRICA"
                }, {
                    "id": "5d426996-c822-4ea4-a889-808b6de86137",
                    "first_name": "Jose Maria",
                    "last_name": "Olazabal",
                    "country": "SPAIN"
                }]
            }, {
                "tee_time": "2018-04-05T13:14:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "0096b26b-fc25-4fcf-90b9-4b796e3f6c5a",
                    "first_name": "Bryson",
                    "last_name": "DeChambeau",
                    "country": "UNITED STATES"
                }, {
                    "id": "5110ca94-f5bc-4e65-ba3d-a909b91fd8fc",
                    "first_name": "Bernd",
                    "last_name": "Wiesberger",
                    "country": "AUSTRIA"
                }, {
                    "id": "04b52e10-1f50-4efb-9895-86b4107f78c4",
                    "first_name": "Matthew",
                    "last_name": "Fitzpatrick",
                    "country": "ENGLAND"
                }]
            }, {
                "tee_time": "2018-04-05T13:25:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "90cbb198-4635-40bb-92e6-e0755633271d",
                    "first_name": "Mark",
                    "last_name": "O'Meara",
                    "country": "UNITED STATES"
                }, {
                    "id": "c7871ab0-29e3-41ea-823e-1d91cf3d95aa",
                    "first_name": "Harry",
                    "last_name": "Ellis",
                    "country": "ENGLAND"
                }, {
                    "id": "92544280-0438-4f43-a5f3-f3a21ea55157",
                    "first_name": "Brian",
                    "last_name": "Harman",
                    "country": "UNITED STATES"
                }]
            }, {
                "tee_time": "2018-04-05T13:36:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "509991b7-9e9d-48be-9a3b-b75fd23be6ff",
                    "first_name": "Daniel",
                    "last_name": "Berger",
                    "country": "UNITED STATES"
                }, {
                    "id": "4ea366e9-859a-4d7c-b06d-15dd7098b31a",
                    "first_name": "Vijay",
                    "last_name": "Singh",
                    "country": "FIJI"
                }, {
                    "id": "a6e8282b-2a5d-44fb-b28a-4e5c27770aaf",
                    "first_name": "Satoshi",
                    "last_name": "Kodaira",
                    "country": "JAPAN"
                }]
            }, {
                "tee_time": "2018-04-05T13:47:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "827eafe9-e092-4020-bc94-634b031900ed",
                    "first_name": "Pat",
                    "last_name": "Perez",
                    "country": "UNITED STATES"
                }, {
                    "id": "b2e3e856-8a51-4fc8-9fc9-d9346c51e2db",
                    "first_name": "Kiradech",
                    "last_name": "Aphibarnrat",
                    "country": "THAILAND"
                }, {
                    "id": "37f07f5b-f185-42d1-ad9a-f665df493554",
                    "first_name": "Francesco",
                    "last_name": "Molinari",
                    "country": "ITALY"
                }]
            }, {
                "tee_time": "2018-04-05T13:58:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "4dc6e9c7-dd5b-4cf2-a7fe-b9c94c7a9110",
                    "first_name": "Jason",
                    "last_name": "Dufner",
                    "country": "UNITED STATES"
                }, {
                    "id": "8dc45e61-5a03-4c85-9245-c2127d401a80",
                    "first_name": "Danny",
                    "last_name": "Willett",
                    "country": "ENGLAND"
                }, {
                    "id": "c44c8311-3669-4bc0-b25e-a7bbf5e53cf8",
                    "first_name": "Kyle",
                    "last_name": "Stanley",
                    "country": "UNITED STATES"
                }]
            }, {
                "tee_time": "2018-04-05T14:09:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "d45bcf4a-5803-4b0b-ab6c-6427a76cecf7",
                    "first_name": "Hideki",
                    "last_name": "Matsuyama",
                    "country": "JAPAN"
                }, {
                    "id": "3442d4dd-ecfa-43aa-9a01-7525e6f4952c",
                    "first_name": "Patton",
                    "last_name": "Kizzire",
                    "country": "UNITED STATES"
                }, {
                    "id": "e46760f3-85e4-4a31-be04-fa2d067760d0",
                    "first_name": "Paul",
                    "last_name": "Casey",
                    "country": "ENGLAND"
                }]
            }, {
                "tee_time": "2018-04-05T14:31:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "59bafc5a-e5cd-4145-a993-04af3b94caac",
                    "first_name": "Branden",
                    "last_name": "Grace",
                    "country": "SOUTH AFRICA"
                }, {
                    "id": "ea0dab27-4813-48bb-97e2-96d61e0a5581",
                    "first_name": "Martin",
                    "last_name": "Kaymer",
                    "country": "GERMANY"
                }, {
                    "id": "ace28c92-bea0-4aaa-b3c4-c992971eb59d",
                    "first_name": "Zach",
                    "last_name": "Johnson",
                    "country": "UNITED STATES"
                }]
            }, {
                "tee_time": "2018-04-05T14:42:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "6873b37f-d2ed-46e2-8d4a-8b30ba67311c",
                    "first_name": "Marc",
                    "last_name": "Leishman",
                    "country": "AUSTRALIA"
                }, {
                    "id": "6577ec3d-9e78-4979-8f4c-01c465fa6b1d",
                    "first_name": "Tommy",
                    "last_name": "Fleetwood",
                    "country": "ENGLAND"
                }, {
                    "id": "d74e6369-dcb4-4225-8152-90d3f19d2517",
                    "first_name": "Tiger",
                    "last_name": "Woods",
                    "country": "UNITED STATES"
                }]
            }, {
                "tee_time": "2018-04-05T14:53:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "05d808bc-da95-4d5f-ab1c-d02302959f81",
                    "first_name": "Doc",
                    "last_name": "Redman",
                    "country": "UNITED STATES"
                }, {
                    "id": "2094fa02-6411-48df-a717-aa1a7228d645",
                    "first_name": "Justin",
                    "last_name": "Thomas",
                    "country": "UNITED STATES"
                }, {
                    "id": "a334e19f-ebb9-4497-b2ad-71b9c1c6e1f8",
                    "first_name": "Sergio",
                    "last_name": "Garcia",
                    "country": "SPAIN"
                }]
            }, {
                "tee_time": "2018-04-05T15:04:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "24c9d97d-1801-459e-9778-c37ad6d20ecf",
                    "first_name": "Henrik",
                    "last_name": "Stenson",
                    "country": "SWEDEN"
                }, {
                    "id": "414bf151-7adc-4857-801d-ef2d7f84953e",
                    "first_name": "Bubba",
                    "last_name": "Watson",
                    "country": "UNITED STATES"
                }, {
                    "id": "97cd8ce8-beb2-484e-9081-ccba9baa0607",
                    "first_name": "Jason",
                    "last_name": "Day",
                    "country": "AUSTRALIA"
                }]
            }, {
                "tee_time": "2018-04-05T15:15:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "085c0b40-e456-4d46-b011-f992a4ee8a68",
                    "first_name": "Adam",
                    "last_name": "Hadwin",
                    "country": "CANADA"
                }, {
                    "id": "12195ed9-3fcd-486a-86b4-1ec726d201cd",
                    "first_name": "Patrick",
                    "last_name": "Reed",
                    "country": "UNITED STATES"
                }, {
                    "id": "25366155-7268-4630-baf7-7a27d5e18385",
                    "first_name": "Charley",
                    "last_name": "Hoffman",
                    "country": "UNITED STATES"
                }]
            }, {
                "tee_time": "2018-04-05T15:26:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "a76f47fb-8523-457b-8b16-2c88d8e5c892",
                    "first_name": "Chez",
                    "last_name": "Reavie",
                    "country": "UNITED STATES"
                }, {
                    "id": "f04f89c3-3f8f-4009-bc49-0de2a634ead3",
                    "first_name": "Billy",
                    "last_name": "Horschel",
                    "country": "UNITED STATES"
                }, {
                    "id": "aee6ead9-10e0-445b-aa13-d037cc1dd861",
                    "first_name": "Cameron",
                    "last_name": "Smith",
                    "country": "AUSTRALIA"
                }]
            }, {
                "tee_time": "2018-04-05T15:37:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "21886b8c-d915-4bbc-9bda-0352821c432b",
                    "first_name": "Si Woo",
                    "last_name": "Kim",
                    "country": "SOUTH KOREA"
                }, {
                    "id": "9da0b6ed-e6e2-4531-95ee-1a6628aa3382",
                    "first_name": "Sandy",
                    "last_name": "Lyle",
                    "country": "SCOTLAND"
                }, {
                    "id": "fa4b1348-de92-49e6-9379-b96b936055fe",
                    "first_name": "Doug",
                    "last_name": "Ghim",
                    "country": "UNITED STATES"
                }]
            }, {
                "tee_time": "2018-04-05T15:48:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "1c1bcd8d-396b-44ed-83a4-068b4977bed2",
                    "first_name": "Trevor",
                    "last_name": "Immelman",
                    "country": "SOUTH AFRICA"
                }, {
                    "id": "a6cc9ac9-6bfc-4116-9436-041da10e6f7b",
                    "first_name": "Ian",
                    "last_name": "Poulter",
                    "country": "ENGLAND"
                }, {
                    "id": "d072ae36-88f2-4276-b97e-6de87aa2b875",
                    "first_name": "Patrick",
                    "last_name": "Cantlay",
                    "country": "UNITED STATES"
                }]
            }, {
                "tee_time": "2018-04-05T15:59:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "3abebff6-334f-41ae-861f-999abe2ac494",
                    "first_name": "Ross",
                    "last_name": "Fisher",
                    "country": "ENGLAND"
                }, {
                    "id": "2db60f6e-7b0a-4daf-97d9-01a057f44f1d",
                    "first_name": "Jimmy",
                    "last_name": "Walker",
                    "country": "UNITED STATES"
                }, {
                    "id": "7c9efe97-b74b-42d0-b849-1775e6fda93e",
                    "first_name": "Angel",
                    "last_name": "Cabrera",
                    "country": "ARGENTINA"
                }]
            }, {
                "tee_time": "2018-04-05T16:10:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "98e7362d-2df7-4d1d-8e49-a3de535203f3",
                    "first_name": "Fred",
                    "last_name": "Couples",
                    "country": "UNITED STATES"
                }, {
                    "id": "81a12293-b97e-4b11-9686-a1e0bc8a4096",
                    "first_name": "Hao-Tong",
                    "last_name": "Li",
                    "country": "CHINA"
                }, {
                    "id": "4249bf6e-9723-4a4a-9ddd-515022618de9",
                    "first_name": "Joaquin",
                    "last_name": "Niemann",
                    "country": "CHILE"
                }]
            }, {
                "tee_time": "2018-04-05T16:32:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "42e0006b-1a4f-458f-84a7-8bd3ab8a48d9",
                    "first_name": "Shubhankar",
                    "last_name": "Sharma",
                    "country": "INDIA"
                }, {
                    "id": "1412afcc-2a90-48fc-b41c-b7e063d3f5da",
                    "first_name": "Larry",
                    "last_name": "Mize",
                    "country": "UNITED STATES"
                }, {
                    "id": "d8a9ce2c-9bdf-4e54-b53e-58692a1f4d59",
                    "first_name": "Russell",
                    "last_name": "Henley",
                    "country": "UNITED STATES"
                }]
            }, {
                "tee_time": "2018-04-05T16:43:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "c97e871e-c305-406d-9f92-1d8b4a5fd83a",
                    "first_name": "Yuta",
                    "last_name": "Ikeda",
                    "country": "JAPAN"
                }, {
                    "id": "f33d746b-8e14-4325-a4e1-81d6f983b163",
                    "first_name": "Tony",
                    "last_name": "Finau",
                    "country": "UNITED STATES"
                }, {
                    "id": "ad04909f-3738-4a1b-b931-6d91bace0710",
                    "first_name": "Bernhard",
                    "last_name": "Langer",
                    "country": "GERMANY"
                }]
            }, {
                "tee_time": "2018-04-05T16:54:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "b5bc483c-abe0-46b8-aff8-187563621ffa",
                    "first_name": "Charl",
                    "last_name": "Schwartzel",
                    "country": "SOUTH AFRICA"
                }, {
                    "id": "5ffb79c3-154e-4707-a330-550d4bcc333f",
                    "first_name": "Yuxin",
                    "last_name": "Lin",
                    "country": "CHINA"
                }, {
                    "id": "4ad10e99-8294-4e80-bbe7-782f55f0a2ac",
                    "first_name": "Webb",
                    "last_name": "Simpson",
                    "country": "UNITED STATES"
                }]
            }, {
                "tee_time": "2018-04-05T17:05:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "26dc0bda-b9a8-4303-9c1c-ddecda3817d2",
                    "first_name": "Xander",
                    "last_name": "Schauffele",
                    "country": "UNITED STATES"
                }, {
                    "id": "7890cd00-16ad-49ac-a6cc-6fb4853ae0ce",
                    "first_name": "Kevin",
                    "last_name": "Kisner",
                    "country": "UNITED STATES"
                }, {
                    "id": "ca223d44-1117-4b73-b349-9dafd6764b17",
                    "first_name": "Thomas",
                    "last_name": "Pieters",
                    "country": "BELGIUM"
                }]
            }, {
                "tee_time": "2018-04-05T17:16:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "8ab83e3c-6de3-4804-b477-825bc1bf1059",
                    "first_name": "Yusaku",
                    "last_name": "Miyazato",
                    "country": "JAPAN"
                }, {
                    "id": "ce5a1cd5-bf8c-4f0d-9903-844ec3aa7e10",
                    "first_name": "Tyrrell",
                    "last_name": "Hatton",
                    "country": "ENGLAND"
                }, {
                    "id": "2d568087-700f-44a2-8390-47aa7bafc770",
                    "first_name": "Gary",
                    "last_name": "Woodland",
                    "country": "UNITED STATES"
                }]
            }, {
                "tee_time": "2018-04-05T17:27:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "047de4e6-1cfe-4166-90e8-492add1161e3",
                    "first_name": "Matt",
                    "last_name": "Kuchar",
                    "country": "UNITED STATES"
                }, {
                    "id": "3f423647-083c-4da9-8ee6-344df4af116f",
                    "first_name": "Phil",
                    "last_name": "Mickelson",
                    "country": "UNITED STATES"
                }, {
                    "id": "5735703a-32d9-4a6c-8b24-6596f300bc44",
                    "first_name": "Rickie",
                    "last_name": "Fowler",
                    "country": "UNITED STATES"
                }]
            }, {
                "tee_time": "2018-04-05T17:38:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "7b52b9be-a490-4569-9bbc-57db5f232dcb",
                    "first_name": "Jon",
                    "last_name": "Rahm",
                    "country": "SPAIN"
                }, {
                    "id": "da226913-b804-48de-adbf-96e956eb75ac",
                    "first_name": "Rory",
                    "last_name": "McIlroy",
                    "country": "NORTHERN IRELAND"
                }, {
                    "id": "45be1496-ea36-4c0c-8573-4a457ab70573",
                    "first_name": "Adam",
                    "last_name": "Scott",
                    "country": "AUSTRALIA"
                }]
            }, {
                "tee_time": "2018-04-05T17:49:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "88bc83d5-45d0-4be3-9dd1-1af5282a718e",
                    "first_name": "Alexander",
                    "last_name": "Noren",
                    "country": "SWEDEN"
                }, {
                    "id": "c19bc908-1c6a-4315-b51c-fa5a335bfeec",
                    "first_name": "Louis",
                    "last_name": "Oosthuizen",
                    "country": "SOUTH AFRICA"
                }, {
                    "id": "3e4963cb-6e80-4393-85cf-2aecec453c4a",
                    "first_name": "Jordan",
                    "last_name": "Spieth",
                    "country": "UNITED STATES"
                }]
            }, {
                "tee_time": "2018-04-05T18:00:00+00:00",
                "back_nine": false,
                "players": [{
                    "id": "c11235f6-0f62-4afb-93e7-952dc0554649",
                    "first_name": "Justin",
                    "last_name": "Rose",
                    "country": "ENGLAND"
                }, {
                    "id": "a7041051-eb25-40b9-acb3-dab88cae69c0",
                    "first_name": "Dustin",
                    "last_name": "Johnson",
                    "country": "UNITED STATES"
                }, {
                    "id": "12e24cec-7dbe-45d7-ab6a-f8a6de24740f",
                    "first_name": "Rafael",
                    "last_name": "Cabrera-Bello",
                    "country": "SPAIN"
                }]
            }]
        }]
    }
}

function groupPairings(pairings, groupNums) {
  let groupedPairings = [];
  let pLen = pairings.length;
  let remainder = pLen % groupNums;
  let ppg = pLen/groupNums;
  let max = Math.ceil(ppg);
  let min = Math.floor(ppg);

  for (let i=0; i<groupNums; i++) {
    let size = !remainder ? ppg : (i<remainder ? max : min);

    let group = pairings
                  .splice(0, size)
                  .map(g=>g.players.map(p=>({
                    tee_time: g.tee_time,
                    ...p
                  })))
                  .reduce((acc, val) => acc.concat(val), []);

    groupedPairings.push(group);
  }
  return groupedPairings;
}

let pairings = response.round.courses[0].pairings;
let groups = groupPairings(pairings, 10);
console.log('setting')
client.set(`tournaments:b404a8d5-5e33-4417-ae20-5d4d147042ee:groups`, JSON.stringify({groups:groups}));
