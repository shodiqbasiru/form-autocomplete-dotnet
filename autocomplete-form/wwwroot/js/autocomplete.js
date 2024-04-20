$(document).ready(function () {
    let selectedCountryCode = "";
    const BASE_URL = 'https://insw-dev.ilcs.co.id/n/';
    $('#country').autocomplete({
        minLength: 3,
        source: function (req, res) {
            $.ajax({
                url: `${BASE_URL}negara?ur_negara=${encodeURIComponent(req.term)}`,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    if (data && data.length > 0) {
                        res(data.map(item => ({label: item.name, value: item.name, code: item.kd_negara})));
                    } else {
                        res([{label: "Data tidak ditemukan", value: ""}]);
                    }
                },
            });
        },
        select: function (event, ui) {
            $("#country").val(ui.item.value);
            selectedCountryCode = ui.item.code;
            return false;
        }
    });

    $('#harbour').autocomplete({
        minLength: 3,
        source: function (req, res) {
            $.ajax({
                url: `${BASE_URL}pelabuhan?kd_negara=${encodeURIComponent(selectedCountryCode)}&ur_pelabuhan=${encodeURIComponent(req.term)}`,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    if (data && data.length > 0) {
                        res(data.map(item => ({label: item.ur_pelabuhan, value: item.ur_pelabuhan})));
                    } else {
                        res([{label:"Data tidak ditemukan", value: ""}])
                    }
                },
            });
        },
        select: function (event, ui) {
            $("#harbour").val(ui.item.value);
            return false;
        }
    });

    $('#product').on('input', function () {
        const id = $(this).val();
        const textarea = $('#productData');
        const customRates = $('#custom-rates');

        if (id.length >= 8) {
            console.log(id)
            $.ajax({
                url: `${BASE_URL}barang?hs_code=${encodeURIComponent(id)}`,
                type: "GET",
                dataType: "json",
                success: function (data) {
                    if (data && data[0] && data[0].details) {
                        textarea.val(data[0].details.join('\n'));
                    }
                    $.ajax({
                        url: `${BASE_URL}tarif?hs_code=${encodeURIComponent(id)}`,
                        type: 'GET',
                        dataType: "json",
                        success: function (data) {
                            customRates.val(data[0].rate_bea_masuk);

                        }
                    });
                },
            });
        }

    });

    $('#price').on('input', function () {
        const price = $(this).val();
        const customRates = $('#custom-rates').val();
        const resultCustomRates = $('#result-custom-rates');
        if (price && customRates) {
            resultCustomRates.val((price * customRates) / 100);
        } else {
            resultCustomRates.val(0);
        }
    });

});
