import {configureStore} from '@reduxjs/toolkit'
import MajelisTaklimReducer from './MajelisTaklimSlicer'
import PengajuanBaruReducer from './PengajuanBaruSlicer'
import PengajuanPembaharuanreducer from './PengajuanPembaharuanSlicer'
import StatusPengajuanreducer from './StatusPengajuanSlicer'

const store = configureStore({
    reducer: {
        MajelisTaklim: MajelisTaklimReducer,
        PengajuanBaru: PengajuanBaruReducer,
        PengajuanPembaharuan: PengajuanPembaharuanreducer,
        StatusPengajuan: StatusPengajuanreducer
}

})
export default store;