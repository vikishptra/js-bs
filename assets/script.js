const indexPage = () => {
    $('#index').click(() => {
        document.location.href = 'index.html';
    });
    $('.full-screen').click(() => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }

    });
};
const quranPage = () => {
    //Quran.html
    $.get('https://api.alquran.cloud/v1/surah', (data) => {
        isiDaftar(data.data);
        $('.loading').css('display', 'none');
    });


    const isiDaftar = (data) => {
        let i = 1;
        data.forEach((d) => {
            const elemenList = `<tr  class="">
                            <th class="td1" width="20"><div class="no_s">${i}</div> </th>
                            <td class="td2 tebal nama_s" no-surah="${d.number}">${d.englishName}</td>
                            <td class="td2 text-right">${d.numberOfAyahs} Ayat</td>
                        </tr>`;
            $('#list').append(elemenList);
            i++;
        });

        $('.nama_s').click((e) => {
            document.location.href = `surah1.html?${$(e.target).attr('no-surah')}`;
        });
    };
};

const surahPage = () => {
    //Surah.html
    const url = window.location.href;
    let no_s = '';
    let no_a;
    if (url.search('#') != -1) {
        no_s = url.substring(url.indexOf('?') + 1, url.indexOf('#'));
        no_a = url.substr(url.indexOf('#') + 1);
    } else {
        no_s = url.substr(url.indexOf('?') + 1);
    }

    const url_api = `https://api.alquran.cloud/v1/surah/${no_s}/editions/ar.alafasy,en.transliteration,id.indonesian`;
    let surah = [];
    let jmlAyah;



    $.get(url_api, (data) => {
        isiData(data.data);
        jmlAyah = data.data[0].numberOfAyahs;
        $('.loading').css('display', 'none');
        $('.judul').text(`Surah ${data.data[0].englishName}`);
    });

    const isiData = (data) => {
        for (let i = 0; i < data[0].numberOfAyahs; i++) {
            const obj = {
                arab: '',
                latin: '',
                indo: '',
                audio: ''

            };
            surah.push(obj);
        }

        let i = 0;
        data[0].ayahs.forEach((ayah) => {
            surah[i].audio = ayah.audio;

            i++;
        });
        i = 0;
        data[0].ayahs.forEach((ayah) => {
            surah[i].arab = ayah.text;

            i++;
        });

        i = 0;
        data[1].ayahs.forEach((ayah) => {
            surah[i].latin = ayah.text;

            i++;
        });

        i = 0;
        data[2].ayahs.forEach((ayah) => {
            surah[i].indo = ayah.text;

            i++;
        });

        tampilkanData();
    };

    const tampilkanData = () => {
        i = 1;
        surah.forEach((ayah) => {
            const elementList =
                `<li class="list-item" id="${i}">
            <div class="item-icon">
                <div class="no-ayat">
                    ${i}
                </div>
                <a class="text text-success"><i class="fas fa-play" data-id="${i}"></i></a><br>
                <span class="text text-dark"><i
            class="fas fa-stop-circle fa-lg"></i></span>
            </div>
            <div class="item-teks">
                <div class="teks-arab">${ayah.arab}</div>
                <div class="teks-latin" style="display: none;">${ayah.latin}</div>
                <div class="teks-indo">${ayah.indo}</div>
            </div>
        </li>`;

            $('#list-ayah').append(elementList);

            i++;
        });

        $('.fa-play').click((e) => {
            methodPlay(e)
        });
        $('.fa-stop-circle').click(() => {
            stopAudio();
        });
    
        if (url.search('#') != -1) {
            document.getElementById(no_a).scrollIntoView();
        }
    }

    const methodPlay = (e) => {
        //tampilAudio();
        playAudio($(e.target).attr('data-id'));
    };

    let sedangDimainkan = false;
    
    const playAudio = (no) => {
        if(sedangDimainkan){
            stopAudio();
        }
        const el = `<audio id="surahPlayer" src="${surah[no-1].audio}" type="audio/mp3" controls="controls" class="audioAyah audioAyah${no}"></audio>`;
        $('.list-audio').append(el);

        const audioAyah = document.querySelector(`.audioAyah${no}`);
        audioAyah.play();
        no++;

        if (no <= jmlAyah) {
            audioAyah.addEventListener('ended', () => {
                playAudio(no);
            });
        }

        if(no == jmlAyah){
            sedangDimainkan = true;
        }

    };
    const stopAudio = () => {
        const audioAyah = document.querySelectorAll('.audioAyah');
        audioAyah.forEach((audAy) => {
            audAy.pause();
            audAy.currentTime = 0;
        });
        sedangDimainkan = true;
    };
};