export const categories = [
  { id: 'an_vat', name: 'Ăn Vặt' },
  { id: 'mi_tom', name: 'Mì Tôm' },
  { id: 'xien_ban', name: 'Xiên Bẩn' },
  { id: 'nuoc_uong', name: 'Nước Uống' }
];

export const initialMenu = [
  {
    id: '1',
    name: 'Bánh Tráng Trộn',
    description: 'Bánh tráng, xoài, trứng cút, khô bò, sốt đặc biệt',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1626082895617-2c6b412bfd38?auto=format&fit=crop&q=80&w=400',
    category: 'an_vat',
    isBestseller: true,
    options: [
      {
        id: 'opt_spicy',
        name: 'Độ cay',
        type: 'single',
        choices: [
          { name: 'Không cay', price: 0 },
          { name: 'Cay vừa', price: 0 },
          { name: 'Cay nhiều', price: 0 }
        ]
      },
      {
        id: 'opt_topping',
        name: 'Thêm Topping',
        type: 'multiple',
        choices: [
          { name: 'Thêm trứng cút (3 quả)', price: 5000 },
          { name: 'Thêm khô bò', price: 10000 },
          { name: 'Thêm xoài', price: 5000 }
        ]
      }
    ]
  },
  {
    id: '2',
    name: 'Trà Sữa Trân Châu Koko',
    description: 'Trà sữa đậm vị trà, trân châu đen dai giòn',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1558857563-b37102e99eab?auto=format&fit=crop&q=80&w=400',
    category: 'nuoc_uong',
    options: [
      {
        id: 'opt_size',
        name: 'Kích cỡ',
        type: 'single',
        choices: [
          { name: 'Size M', price: 0 },
          { name: 'Size L', price: 10000 }
        ]
      },
      {
        id: 'opt_ice',
        name: 'Mức đá',
        type: 'single',
        choices: [
          { name: '100% Đá', price: 0 },
          { name: '50% Đá', price: 0 },
          { name: 'Không Đá', price: 0 }
        ]
      }
    ]
  },
  {
    id: '3',
    name: 'Mì Trộn Tương Đen',
    description: 'Mì dai ngon trộn sốt tương đen Hàn Quốc, kèm trứng ốp la',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400',
    category: 'mi_tom',
    options: [
      {
        id: 'opt_egg',
        name: 'Trứng',
        type: 'single',
        choices: [
          { name: 'Khô (Chín kỹ)', price: 0 },
          { name: 'Lòng đào', price: 0 }
        ]
      },
      {
        id: 'opt_extra',
        name: 'Thêm đồ',
        type: 'multiple',
        choices: [
          { name: 'Thêm xúc xích', price: 10000 },
          { name: 'Thêm phô mai', price: 8000 }
        ]
      }
    ]
  },
  {
    id: '4',
    name: 'Mẹt Xiên Đồng Giá 5k (10 xiên)',
    description: 'Cá viên, bò viên, tôm viên, đậu hũ phô mai',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1556096535-645b23d517c6?auto=format&fit=crop&q=80&w=400',
    category: 'xien_ban',
    isBestseller: true,
    options: [
      {
        id: 'opt_dip',
        name: 'Nước chấm',
        type: 'multiple',
        choices: [
          { name: 'Tương ớt', price: 0 },
          { name: 'Tương đen', price: 0 },
          { name: 'Sốt Mayonnaise', price: 5000 }
        ]
      }
    ]
  },
  {
    id: '5',
    name: 'Mì Cay 7 Cấp Độ',
    description: 'Mì cay Hàn Quốc, tôm, mực, xúc xích',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&q=80&w=400',
    category: 'mi_tom',
    options: [
      {
        id: 'opt_level',
        name: 'Cấp độ cay',
        type: 'single',
        choices: [
          { name: 'Cấp 0 (Không cay)', price: 0 },
          { name: 'Cấp 1', price: 0 },
          { name: 'Cấp 3', price: 0 },
          { name: 'Cấp 7', price: 0 }
        ]
      }
    ]
  },
  {
    id: '6',
    name: 'Trà Đào Cam Sả',
    description: 'Trà đào thơm lừng, thanh mát',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&q=80&w=400',
    category: 'nuoc_uong',
    isBestseller: true,
    options: []
  },
  {
    id: '7',
    name: 'Bánh Tráng Nướng',
    description: 'Bánh tráng nướng giòn, trứng, bò khô, hành lá',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=400',
    category: 'an_vat',
    options: []
  },
  {
    id: '8',
    name: 'Khoai Tây Chiên Lắc Phô Mai',
    description: 'Khoai tây giòn rụm, bột phô mai béo ngậy',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1518013032307-302f85d6389a?auto=format&fit=crop&q=80&w=400',
    category: 'an_vat',
    options: []
  },
  {
    id: '9',
    name: 'Bắp Xào Tép',
    description: 'Bắp nếp xào bơ, tép khô, hành lá',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1563379091339-a74930885221?auto=format&fit=crop&q=80&w=400',
    category: 'an_vat',
    options: []
  },
  {
    id: '10',
    name: 'Chân Gà Sả Tắc',
    description: 'Chân gà giòn, sả, tắc, ớt cay nồng',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1615485240318-11306bc129ed?auto=format&fit=crop&q=80&w=400',
    category: 'an_vat',
    options: []
  },
  {
    id: '11',
    name: 'Gỏi Khô Bò',
    description: 'Đu đủ bào, khô bò, lạc rang, rau thơm',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&q=80&w=400',
    category: 'an_vat',
    options: []
  },
  {
    id: '12',
    name: 'Nem Chua Rán',
    description: 'Nem chua tẩm bột chiên xù giòn tan (5 chiếc)',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1582234372722-50d7ccc30ebd?auto=format&fit=crop&q=80&w=400',
    category: 'an_vat',
    options: []
  },
  {
    id: '13',
    name: 'Xoài Lắc Muối Ớt',
    description: 'Xoài keo giòn, muối tôm đặc sản',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1591073113125-e46713c829ed?auto=format&fit=crop&q=80&w=400',
    category: 'an_vat',
    options: []
  },
  {
    id: '14',
    name: 'Mì Indomie Trứng Ốp La',
    description: 'Mì xào khô quốc dân, kèm trứng ốp la lòng đào',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&q=80&w=400',
    category: 'mi_tom',
    options: []
  },
  {
    id: '15',
    name: 'Mì Trộn Muối Ớt',
    description: 'Mì trộn đặc biệt, muối ớt, tôm khô, da heo',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1552611052-d59a0d9741bc?auto=format&fit=crop&q=80&w=400',
    category: 'mi_tom',
    options: []
  },
  {
    id: '16',
    name: 'Mì Xào Bò Rau Cải',
    description: 'Mì xào mềm với thịt bò thăn và rau cải tươi',
    price: 50000,
    image: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=400',
    category: 'mi_tom',
    options: []
  },
  {
    id: '17',
    name: 'Mì Tôm Chanh Hà Nội',
    description: 'Hương vị tuổi thơ với trứng và thịt bằm',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=400',
    category: 'mi_tom',
    options: []
  },
  {
    id: '18',
    name: 'Mì Lẩu Thái Hải Sản',
    description: 'Nước dùng chua cay, tôm, mực, nghêu',
    price: 65000,
    image: 'https://images.unsplash.com/photo-1511910849309-0dffb8785146?auto=format&fit=crop&q=80&w=400',
    category: 'mi_tom',
    options: []
  },
  {
    id: '19',
    name: 'Mì Trộn Hải Sản Trứng Muối',
    description: 'Sốt trứng muối béo ngậy bọc quanh sợi mì',
    price: 55000,
    image: 'https://images.unsplash.com/photo-1594759077578-21629a440521?auto=format&fit=crop&q=80&w=400',
    category: 'mi_tom',
    options: []
  },
  {
    id: '20',
    name: 'Mì Hoành Thánh Tôm Thịt',
    description: 'Hoành thánh tự làm, tôm tươi nguyên con',
    price: 45000,
    image: 'https://images.unsplash.com/photo-1526318896980-cf78ca088247?auto=format&fit=crop&q=80&w=400',
    category: 'mi_tom',
    options: []
  },
  {
    id: '21',
    name: 'Hồ Lô Nướng',
    description: 'Hồ lô nướng mật ong thơm lừng',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1532634896-26909d0d4b89?auto=format&fit=crop&q=80&w=400',
    category: 'xien_ban',
    options: []
  },
  {
    id: '22',
    name: 'Xúc Xích Đức Nướng',
    description: 'Xúc xích Đức xông khói, dai giòn',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1541048612927-b244d245bdfd?auto=format&fit=crop&q=80&w=400',
    category: 'xien_ban',
    options: []
  },
  {
    id: '23',
    name: 'Đậu Hũ Phô Mai Chiên',
    description: 'Đậu hũ mềm, nhân phô mai tan chảy',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400',
    category: 'xien_ban',
    options: []
  },
  {
    id: '24',
    name: 'Chả Cá Sợi Chiên Giòn',
    description: 'Chả cá thác lác quết tay, chiên vàng',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1589113103503-49653d891dcc?auto=format&fit=crop&q=80&w=400',
    category: 'xien_ban',
    options: []
  },
  {
    id: '25',
    name: 'Tôm Viên Chiên',
    description: 'Tôm viên đậm đà, thơm mùi tôm tươi',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=400',
    category: 'xien_ban',
    options: []
  },
  {
    id: '26',
    name: 'Bò Viên Gân',
    description: 'Bò viên giòn sần sật với gân bò',
    price: 12000,
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?auto=format&fit=crop&q=80&w=400',
    category: 'xien_ban',
    options: []
  },
  {
    id: '27',
    name: 'Viên Rau Củ Thập Cẩm',
    description: 'Rau củ xắt nhỏ trộn chả cá thanh đạm',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=400',
    category: 'xien_ban',
    options: []
  },
  {
    id: '28',
    name: 'Thanh Cua Chiên Xù',
    description: 'Thanh cua Nhật Bản tẩm bột chiên xù',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c170db06?auto=format&fit=crop&q=80&w=400',
    category: 'xien_ban',
    options: []
  },
  {
    id: '29',
    name: 'Trà Chanh Giã Tay',
    description: 'Chanh Quảng Đông thơm nồng đặc trưng',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=400',
    category: 'nuoc_uong',
    options: []
  },
  {
    id: '30',
    name: 'Sinh Tố Bơ Sáp',
    description: 'Bơ sáp Daklak xay với sữa đặc',
    price: 40000,
    image: 'https://images.unsplash.com/photo-1543644009-17aa78a97c9b?auto=format&fit=crop&q=80&w=400',
    category: 'nuoc_uong',
    options: []
  },
  {
    id: '31',
    name: 'Nước Cam Ép Nguyên Chất',
    description: 'Cam sành vắt tay, không đường hóa học',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=400',
    category: 'nuoc_uong',
    options: []
  },
  {
    id: '32',
    name: 'Cà Phê Sữa Đá',
    description: 'Cà phê rang xay nguyên chất, đậm vị Việt',
    price: 20000,
    image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a21?auto=format&fit=crop&q=80&w=400',
    category: 'nuoc_uong',
    options: []
  },
  {
    id: '33',
    name: 'Trà Sữa Thái Xanh',
    description: 'Trà Thái xanh, thạch củ năng, trân châu',
    price: 30000,
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=400',
    category: 'nuoc_uong',
    options: []
  },
  {
    id: '34',
    name: 'Soda Blue Ocean',
    description: 'Soda xanh mướt, siro việt quất và bạc hà',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1536935338788-846bb9981813?auto=format&fit=crop&q=80&w=400',
    category: 'nuoc_uong',
    options: []
  },
  {
    id: '35',
    name: 'Nước Chanh Dây Mật Ong',
    description: 'Chanh dây tươi và mật ong rừng tự nhiên',
    price: 25000,
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=400',
    category: 'nuoc_uong',
    options: []
  },
  {
    id: '36',
    name: 'Trà Vải Nhiệt Đới',
    description: 'Trà đen, vải thiều tươi, bạc hà',
    price: 35000,
    image: 'https://images.unsplash.com/photo-1544145945-f904253db0ad?auto=format&fit=crop&q=80&w=400',
    category: 'nuoc_uong',
    options: []
  }
];

export const formatPrice = (price) => {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};
