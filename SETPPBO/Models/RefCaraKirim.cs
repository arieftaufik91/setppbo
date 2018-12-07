using System;
using System.Collections.Generic;

namespace SETPPBO.Models
{
    public partial class RefCaraKirim
    {
        public RefCaraKirim()
        {
            PermohonanRefCaraKirimBantahan = new HashSet<Permohonan>();
            PermohonanRefCaraKirimPencabutan = new HashSet<Permohonan>();
            PermohonanRefCaraKirimPermohonan = new HashSet<Permohonan>();
            PermohonanRefCaraKirimSubSt = new HashSet<Permohonan>();
            SuratPengantar = new HashSet<SuratPengantar>();
        }

        public int RefCaraKirimId { get; set; }
        public string Uraian { get; set; }

        public ICollection<Permohonan> PermohonanRefCaraKirimBantahan { get; set; }
        public ICollection<Permohonan> PermohonanRefCaraKirimPencabutan { get; set; }
        public ICollection<Permohonan> PermohonanRefCaraKirimPermohonan { get; set; }
        public ICollection<Permohonan> PermohonanRefCaraKirimSubSt { get; set; }
        public ICollection<SuratPengantar> SuratPengantar { get; set; }
    }
}
