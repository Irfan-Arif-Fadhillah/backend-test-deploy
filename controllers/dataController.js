// CONTROLLER: Tempat otak / logika berjalan

// Simpan data sementara di memory (untuk belajar, biasanya pakai database)
let data = [
    { id: 1, nama: "Irfan", umur: 20, kota: "Jakarta" },
    { id: 2, nama: "Arif", umur: 22, kota: "Bandung" },
    { id: 3, nama: "Fadhillah", umur: 21, kota: "Surabaya" }
];

// GET ALL - Ambil semua data
exports.getAllData = (req, res) => {
    console.log("GET: Mengambil semua data");
    res.json({
        success: true,
        message: "Data berhasil diambil",
        data: data,
        total: data.length
    });
};

// GET BY ID - Ambil data berdasarkan ID
exports.getDataById = (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`GET: Mencari data dengan ID ${id}`);
    
    const item = data.find(d => d.id === id);
    
    if (item) {
        res.json({
            success: true,
            message: "Data ditemukan",
            data: item
        });
    } else {
        res.status(404).json({
            success: false,
            message: "Data tidak ditemukan",
            data: null
        });
    }
};

// POST - Buat data baru
exports.createData = (req, res) => {
    console.log("POST: Membuat data baru");
    console.log("Data yang diterima:", req.body);
    
    const { nama, umur, kota } = req.body;
    
    // Validasi sederhana
    if (!nama || !umur || !kota) {
        return res.status(400).json({
            success: false,
            message: "Data tidak lengkap! Butuh: nama, umur, kota"
        });
    }
    
    // Buat ID baru (ambil ID tertinggi + 1)
    const newId = data.length > 0 ? Math.max(...data.map(d => d.id)) + 1 : 1;
    
    const newData = {
        id: newId,
        nama: nama,
        umur: parseInt(umur),
        kota: kota
    };
    
    data.push(newData);
    
    res.status(201).json({
        success: true,
        message: "Data berhasil dibuat",
        data: newData
    });
};

// PUT - Update data berdasarkan ID
exports.updateData = (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`PUT: Update data dengan ID ${id}`);
    console.log("Data baru:", req.body);
    
    const index = data.findIndex(d => d.id === id);
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "Data tidak ditemukan"
        });
    }
    
    const { nama, umur, kota } = req.body;
    
    // Update data (jika ada field baru, update; jika tidak, tetap pakai yang lama)
    if (nama) data[index].nama = nama;
    if (umur) data[index].umur = parseInt(umur);
    if (kota) data[index].kota = kota;
    
    res.json({
        success: true,
        message: "Data berhasil diupdate",
        data: data[index]
    });
};

// DELETE - Hapus data berdasarkan ID
exports.deleteData = (req, res) => {
    const id = parseInt(req.params.id);
    console.log(`DELETE: Menghapus data dengan ID ${id}`);
    
    const index = data.findIndex(d => d.id === id);
    
    if (index === -1) {
        return res.status(404).json({
            success: false,
            message: "Data tidak ditemukan"
        });
    }
    
    const deletedData = data.splice(index, 1)[0];
    
    res.json({
        success: true,
        message: "Data berhasil dihapus",
        data: deletedData
    });
};